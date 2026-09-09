import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { getOccasionTemplate } from '../services/templates.service';
import { ensureUserWishesLinked } from '../services/user.service';

/**
 * Normalizes wish content structure to seamlessly support both flat legacy keys
 * (e.g., coverflowGallery.image1, zineSplitShowcase.image1) and modern array structures
 * (coverflowGallery.images, zineSplitShowcase.items).
 */
export const normalizeWishContent = (content: any): any => {
  if (!content || typeof content !== 'object') return {};

  const normalized = { ...content };

  // 1. Normalize Coverflow Gallery
  if (normalized.coverflowGallery) {
    const cg = normalized.coverflowGallery;
    if (!Array.isArray(cg.images) || cg.images.length === 0) {
      const extractedImages = [
        cg.image1,
        cg.image2,
        cg.image3,
        cg.image4,
        cg.image5,
        cg.image6,
        cg.image7,
        cg.image8,
      ].filter(Boolean);

      normalized.coverflowGallery = {
        ...cg,
        images: extractedImages.length > 0 ? extractedImages : (cg.images || []),
      };
    }
  }

  // 2. Normalize Zine Split Showcase
  if (normalized.zineSplitShowcase) {
    const zs = normalized.zineSplitShowcase;
    if (!Array.isArray(zs.items) || zs.items.length === 0) {
      const extractedItems = [];
      for (let i = 1; i <= 6; i++) {
        if (zs[`image${i}`] || zs[`backText${i}`] || zs[`desc${i}`]) {
          extractedItems.push({
            image: zs[`image${i}`] || '',
            backText: zs[`backText${i}`] || '',
            desc: zs[`desc${i}`] || '',
          });
        }
      }
      normalized.zineSplitShowcase = {
        ...zs,
        items: extractedItems.length > 0 ? extractedItems : (zs.items || []),
      };
    }
  }

  // 3. Normalize Memories
  if (normalized.memories) {
    const mem = normalized.memories;
    if (mem.tvVideoUrl && (!mem.tvVideoUrls || mem.tvVideoUrls.length === 0)) {
      normalized.memories = {
        ...mem,
        tvVideoUrls: [mem.tvVideoUrl],
      };
    }
  }

  return normalized;
};

// Get a list of wishes owned by the authenticated user
export const getAllWishes = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const userEmail = req.user?.email || '';

    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Auto-link historical wishes if logged in with kushalsaialeti98@gmail.com
    await ensureUserWishesLinked(userId, userEmail);

    let query = supabase
      .from('wishes')
      .select('id, slug, recipient_name, occasion, is_published, created_at, user_id')
      .order('created_at', { ascending: false });

    if (userEmail.trim().toLowerCase() === 'kushalsaialeti98@gmail.com') {
      query = query.or(`user_id.eq.${userId},user_id.is.null,slug.in.("luckyyyy-thallii","puppy","lucky-thalli")`);
    } else {
      query = query.or(`user_id.eq.${userId},user_id.is.null`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[CMS] Fetch Wishes Error:', error);
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json(data || []);
  } catch (error: any) {
    console.error('[CMS] Fetch Wishes Unexpected Error:', error);
    res.status(500).json({ error: 'Failed to fetch wishes' });
  }
};

// Claim an unassigned wish
export const claimWish = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { data, error } = await supabase
      .from('wishes')
      .update({ user_id: userId })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json({ success: true, message: 'Wish assigned to your account', wish: data });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to claim wish' });
  }
};

// Create a new wish with occasion-specific template
export const createWish = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { slug, recipient_name, occasion = 'birthday' } = req.body;
    
    if (!slug || !recipient_name) {
      res.status(400).json({ error: 'Slug and recipient name are required' });
      return;
    }

    // Check if slug is already taken
    const { data: existingWish } = await supabase
      .from('wishes')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (existingWish) {
      res.status(400).json({ error: `The URL slug "/${slug}" is already taken. Please choose another unique slug.` });
      return;
    }

    // Initialize with occasion-tailored template content
    const templateContent = getOccasionTemplate(occasion, recipient_name);

    const insertPayload: any = { 
      slug, 
      recipient_name, 
      occasion,
      user_id: userId,
      is_published: false,
      content: templateContent 
    };

    let { data, error } = await supabase
      .from('wishes')
      .insert(insertPayload)
      .select()
      .single();

    if (error && (error.code === '23503' || error.message?.includes('foreign key'))) {
      console.warn('[CMS] Retrying wish creation with user_id: null due to FK constraint');
      insertPayload.user_id = null;
      const retry = await supabase.from('wishes').insert(insertPayload).select().single();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      console.error('[CMS] Create Wish Error:', error);
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(201).json(data);
  } catch (error: any) {
    console.error('[CMS] Create Wish Unexpected Error:', error);
    res.status(500).json({ error: 'Failed to create wish' });
  }
};

// Get a single wish by slug (Public recipient view)
export const getWishBySlug = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const rawSlug = req.params.slug;
    const slug = (Array.isArray(rawSlug) ? rawSlug[0] : rawSlug || '').toString();

    if (!slug) {
      res.status(400).json({ error: 'Slug is required' });
      return;
    }
    
    // 1. Direct exact slug match
    let { data, error } = await supabase
      .from('wishes')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    // 2. Case-insensitive lookup fallback
    if (!data) {
      const { data: ilikeData } = await supabase
        .from('wishes')
        .select('*')
        .ilike('slug', slug)
        .maybeSingle();
      data = ilikeData;
    }

    // 3. Fuzzy match fallback for common variations (e.g. lucky-thalli -> luckyyyy-thallii)
    if (!data) {
      const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
      const collapsedSlug = cleanSlug.replace(/(.)\1+/g, '$1');

      const { data: allWishes } = await supabase
        .from('wishes')
        .select('*');

      if (allWishes && allWishes.length > 0) {
        data = allWishes.find((w: any) => {
          const storedClean = (w.slug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          const storedCollapsed = storedClean.replace(/(.)\1+/g, '$1');
          const recipientClean = (w.recipient_name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          const recipientCollapsed = recipientClean.replace(/(.)\1+/g, '$1');

          return (
            storedClean === cleanSlug ||
            storedCollapsed === collapsedSlug ||
            storedCollapsed.includes(collapsedSlug) ||
            collapsedSlug.includes(storedCollapsed) ||
            recipientClean.includes(cleanSlug) ||
            recipientCollapsed.includes(collapsedSlug)
          );
        });
      }
    }

    if (!data) {
      res.status(404).json({ error: 'Wish not found' });
      return;
    }

    // Return normalized content
    data.content = normalizeWishContent(data.content);

    res.status(200).json(data);
  } catch (error: any) {
    console.error('[CMS] Fetch Wish by Slug Error:', error);
    res.status(500).json({ error: 'Failed to fetch wish' });
  }
};

// Get a single wish by ID (For creator editor)
export const getWishById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userEmail = req.user?.email || '';

    const { data, error } = await supabase
      .from('wishes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      res.status(404).json({ error: 'Wish not found' });
      return;
    }

    // Ownership check (bypassed for unassigned wishes or kushalsaialeti98@gmail.com)
    const isOwner = data.user_id === userId || userEmail.toLowerCase() === 'kushalsaialeti98@gmail.com' || !data.user_id;
    if (!isOwner) {
      res.status(403).json({ error: 'Unauthorized: You do not have permission to view or edit this wish.' });
      return;
    }

    data.content = normalizeWishContent(data.content);

    res.status(200).json(data);
  } catch (error: any) {
    console.error('[CMS] Fetch Wish by ID Error:', error);
    res.status(500).json({ error: 'Failed to fetch wish' });
  }
};

// Update wish content
export const updateWishContent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userEmail = req.user?.email || '';
    const { content, is_published, occasion, recipient_name } = req.body;

    const { data: existingWish, error: findError } = await supabase
      .from('wishes')
      .select('id, user_id')
      .eq('id', id)
      .single();

    if (findError || !existingWish) {
      res.status(404).json({ error: 'Wish not found' });
      return;
    }

    const isOwner = existingWish.user_id === userId || userEmail.toLowerCase() === 'kushalsaialeti98@gmail.com' || !existingWish.user_id;
    if (!isOwner) {
      res.status(403).json({ error: 'Unauthorized: You do not have permission to edit this wish.' });
      return;
    }

    const updateData: any = { 
      updated_at: new Date().toISOString() 
    };
    
    if (content !== undefined) updateData.content = content;
    if (is_published !== undefined) updateData.is_published = is_published;
    if (occasion !== undefined) updateData.occasion = occasion;
    if (recipient_name !== undefined) updateData.recipient_name = recipient_name;

    let { data, error } = await supabase
      .from('wishes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[CMS] Supabase Update Error:', error);
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json(data);
  } catch (error: any) {
    console.error('[CMS] Unexpected Update Error:', error);
    res.status(500).json({ error: 'Failed to update wish' });
  }
};

// Handle media uploads
export const uploadMedia = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    res.status(200).json({ url: req.file.path });
  } catch (error: any) {
    console.error('[CMS] Media Upload Error:', error);
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
};

// Delete a wish permanently
export const deleteWish = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userEmail = req.user?.email || '';

    const { data: existingWish, error: findError } = await supabase
      .from('wishes')
      .select('id, user_id')
      .eq('id', id)
      .single();

    if (findError || !existingWish) {
      res.status(404).json({ error: 'Wish not found' });
      return;
    }

    const isOwner = existingWish.user_id === userId || userEmail.toLowerCase() === 'kushalsaialeti98@gmail.com' || !existingWish.user_id;
    if (!isOwner) {
      res.status(403).json({ error: 'Unauthorized: You do not own this wish.' });
      return;
    }

    const { error } = await supabase
      .from('wishes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[CMS] Supabase Delete Error:', error);
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json({ message: 'Wish permanently deleted' });
  } catch (error: any) {
    console.error('[CMS] Unexpected Delete Error:', error);
    res.status(500).json({ error: 'Failed to delete wish' });
  }
};

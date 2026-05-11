import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// Get a list of all wishes (for the admin dashboard)
export const getAllWishes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('wishes')
      .select('id, slug, recipient_name, is_published, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wishes' });
  }
};

// Create a new wish (blank template)
export const createWish = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug, recipient_name } = req.body;
    
    if (!slug) {
      res.status(400).json({ error: 'Slug is required' });
      return;
    }

    const { data, error } = await supabase
      .from('wishes')
      .insert({ slug, recipient_name, content: {} })
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create wish' });
  }
};

// Get a single wish by slug (for the user view)
export const getWishBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    
    const { data, error } = await supabase
      .from('wishes')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      res.status(404).json({ error: 'Wish not found' });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wish' });
  }
};

// Get a single wish by ID (for the admin editor)
export const getWishById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('wishes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      res.status(404).json({ error: 'Wish not found' });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wish' });
  }
};

// Update wish content
export const updateWishContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { content, is_published } = req.body;

    const { data, error } = await supabase
      .from('wishes')
      .update({ 
        content, 
        is_published, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update wish' });
  }
};

// Handle media uploads
export const uploadMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    res.status(200).json({ url: req.file.path });
  } catch (error: any) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
};

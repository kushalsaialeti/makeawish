import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// Get all CMS content or content for a specific section
export const getCmsContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { section_id } = req.query;
    
    const query = supabase.from('cms_content').select('*');
    
    if (section_id) {
      const { data, error } = await query.eq('section_id', section_id).single();
      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }
      res.status(200).json(data);
      return;
    }
    
    const { data, error } = await query;

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch CMS content' });
  }
};

// Update CMS content for a section
export const updateCmsContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { section_id } = req.params;
    const { content } = req.body;

    if (!section_id || !content) {
      res.status(400).json({ error: 'section_id and content are required' });
      return;
    }

    // Upsert the content (insert if doesn't exist, update if it does)
    const { data, error } = await supabase
      .from('cms_content')
      .upsert({ section_id, content, updated_at: new Date().toISOString() }, { onConflict: 'section_id' })
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update CMS content' });
  }
};

// Handle generic media uploads for the CMS
export const uploadMedia = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    
    // multer-storage-cloudinary adds path property containing the URL
    res.status(200).json({ url: req.file.path });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
};

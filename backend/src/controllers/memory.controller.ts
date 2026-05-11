import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getMemories = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createMemory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, quote, backgroundWord, orientation } = req.body;
    let imageUrl = '';

    if (req.file) {
      imageUrl = req.file.path; // Cloudinary URL
    }

    const { data, error } = await supabase
      .from('memories')
      .insert([
        { title, description, image_url: imageUrl, quote, background_word: backgroundWord, orientation }
      ])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

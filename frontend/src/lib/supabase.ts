import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tmxpxssichhpmqszyvlj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_4-SRzC8rgrmNKXELvM1U7g_EBhYh_5g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

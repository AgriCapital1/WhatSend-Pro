import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL || 'https://nxgedgwkxhfpzvudlqqk.supabase.co';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable__m5MTe8ohe9stnCzJ-vBBQ_PIWtIdFq';

let supabase = null;

if (url && key) {
  try {
    supabase = createClient(url, key);
  } catch (error) {
    console.error('WhatSend Pro: configuration Supabase invalide.', error);
  }
}

export { supabase };

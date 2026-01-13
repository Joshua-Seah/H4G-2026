import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublicKey = import.meta.env.VITE_SUPABASE_PUBLIC_KEY;

/**
 * Supabase client for general usage
 */
export const db = createClient(supabaseUrl, supabasePublicKey);

// /**
//  * Supabase client for admin usage with elevated privileges
//  */
// export const dbAdmin = createClient(supabaseUrl, supabasePrivKey);
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabasePublicKey = process.env.SUPABASE_PUBLIC_KEY;
const supabasePrivKey = process.env.SUPABASE_PRIV_KEY;

/**
 * Supabase client for general usage
 */
export const db = createClient(supabaseUrl, supabasePublicKey);

/**
 * Supabase client for admin usage with elevated privileges
 */
export const dbAdmin = createClient(supabaseUrl, supabasePrivKey);
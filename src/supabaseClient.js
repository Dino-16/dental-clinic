import { createClient } from '@supabase/supabase-js';

// These names match the Supabase Dashboard exactly
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

/**
 * Supabase is currently DISABLED.
 * The application will automatically use LocalStorage for data persistence.
 * To re-enable, change 'DISABLE_SUPABASE' to false.
 */
const DISABLE_SUPABASE = false;

// Create the client with extra safety to prevent "white screen" crashes
let supabaseClient = null;

const isUrlValid = supabaseUrl && supabaseUrl.startsWith('http') && !supabaseUrl.includes('undefined');
const isKeyValid = supabaseAnonKey && supabaseAnonKey.length > 10; // Basic check for some content

if (isUrlValid && isKeyValid && !DISABLE_SUPABASE) {
    try {
        supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    } catch (err) {
        console.error("Supabase initialization failed:", err.message);
    }
}

export const supabase = supabaseClient;

if (!supabase) {
    if (DISABLE_SUPABASE) {
        console.warn("Supabase has been explicitly DISABLED. Using LocalStorage fallback.");
    } else {
        console.warn("Supabase configuration is missing or invalid. Using LocalStorage fallback.");
    }
}

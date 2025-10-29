import { createClient } from '@supabase/supabase-js';

// --- FIX: Credentials have been added directly to fix the blank screen issue. ---
// In a real production application, these should be stored securely as environment variables
// (e.g., process.env.SUPABASE_URL) and not be hardcoded in the source code.
const supabaseUrl = 'https://djblmscklhoickuwlnpk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqYmxtc2NrbGhvaWNrdXdsbnBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3Mjk5MzUsImV4cCI6MjA3NzMwNTkzNX0.Kg-HUwMn6u5SkkFF7CNiI_DW-iBv_gFgl7Mx-H1ABOY';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
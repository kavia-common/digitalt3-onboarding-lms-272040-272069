import { createClient } from "@supabase/supabase-js";

// PUBLIC_INTERFACE
// Initialize Supabase client using env vars.
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase environment variables missing. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

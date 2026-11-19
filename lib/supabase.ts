import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    `Env belum terbaca. SUPABASE_URL ada=${Boolean(supabaseUrl)}, SUPABASE_PUBLISHABLE_KEY ada=${Boolean(supabaseKey)}`,
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
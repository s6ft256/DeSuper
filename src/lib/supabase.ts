import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "https://vhipieatnyexggqllfqe.supabase.co",
  import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_LjFci6VxYxBw8nZECH9kgg_riyAR1QA"
);

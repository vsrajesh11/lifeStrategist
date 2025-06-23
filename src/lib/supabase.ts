import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Simplified validation
function validateSupabaseConfig() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ Missing Supabase environment variables");
    return false;
  }
  return true;
}

const isConfigValid = validateSupabaseConfig();

// Create client with minimal, stable configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Export configuration status
export const supabaseConfigStatus = {
  isValid: isConfigValid,
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
};

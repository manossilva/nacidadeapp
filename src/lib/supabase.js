import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(
  supabaseUrl  ?? 'https://ayvvxhrzvrudnkyjzsnx.supabase.co',
  supabaseAnonKey ?? 'sb_publishable_z5aZF6q3X_j9-HZwatLlUA_OzQ71yPn',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
)

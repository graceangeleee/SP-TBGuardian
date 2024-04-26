import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://znwimltsagawwpauhjsw.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpud2ltbHRzYWdhd3dwYXVoanN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQwNjA2NzcsImV4cCI6MjAyOTYzNjY3N30.8FdfpYbQk78MR3nUCAb_kf0UeZ3rvYGIjnJutoDv0I0"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
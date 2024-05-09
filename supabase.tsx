import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

// Define a custom storage adapter
const secureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Failed to retrieve item from SecureStore:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Failed to store item in SecureStore:', error);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Failed to remove item from SecureStore:', error);
    }
  },
};

// Supabase configuration using the custom storage adapter
const supabaseUrl = "https://znwimltsagawwpauhjsw.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpud2ltbHRzYWdhd3dwYXVoanN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQwNjA2NzcsImV4cCI6MjAyOTYzNjY3N30.8FdfpYbQk78MR3nUCAb_kf0UeZ3rvYGIjnJutoDv0I0"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: secureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});



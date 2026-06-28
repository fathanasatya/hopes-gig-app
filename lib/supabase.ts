import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Jaring pengaman: Jangan biarkan aplikasi crash total jika .env.local belum terbaca
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("PERINGATAN KEMITRAAN: Kunci Supabase tidak ditemukan di file .env.local!");
}

// Inisialisasi client (akan menggunakan string kosong sementara jika variabel belum terbaca, agar UI tidak mati)
export const supabase = createClient(
  supabaseUrl || 'https://dummy-url.supabase.co', 
  supabaseAnonKey || 'dummy-key'
);
import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  const currentWeek = process.env.CURRENT_WEEK_ID;

  const { data } = await supabase
    .from('submissions')
    .select('username, duration_seconds, finished_at')
    .eq('week_id', currentWeek)
    .eq('status', 'completed')
    .not('duration_seconds', 'is', null) // Pastikan durasi tidak kosong
    
    // --- PERBAIKAN DI SINI ---
    // Ubah 'finished_at' jadi 'duration_seconds'
    // Ascending: true artinya dari angka terkecil (tercepat) ke terbesar
    .order('duration_seconds', { ascending: true }) 
    
    .limit(20);

  return res.status(200).json(data || []);
}
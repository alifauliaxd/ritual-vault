import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username } = req.body;
  const currentWeek = process.env.CURRENT_WEEK_ID;

  if (!username) return res.status(400).json({ error: "Username is required!" });

  // 1. Ambil IP Address
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (ip && ip.includes(',')) ip = ip.split(',')[0].trim();

  try {
    // 2. CEK RATE LIMIT (1 JAM)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { data: recentGames } = await supabase
      .from('submissions')
      .select('finished_at')
      .eq('status', 'completed')
      .or(`username.eq.${username},ip_address.eq.${ip}`) // Cek Nama ATAU IP
      .gt('finished_at', oneHourAgo)
      .limit(1);

    if (recentGames && recentGames.length > 0) {
      const lastFinish = new Date(recentGames[0].finished_at).getTime();
      const waitMinutes = Math.ceil(((lastFinish + 3600000) - Date.now()) / 60000);
      return res.status(429).json({ 
        error: `Calm Bro! Wait for ${waitMinutes} minutes to play again.` 
      });
    }

    // 3. Kalau Aman, Bikin Sesi Baru
    const { data, error } = await supabase
      .from('submissions')
      .insert([{ 
          username, 
          week_id: currentWeek,
          started_at: new Date().toISOString(),
          status: 'playing',
          ip_address: ip 
      }])
      .select()
      .single();

    if (error) throw error;
    return res.status(200).json({ sessionId: data.id });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
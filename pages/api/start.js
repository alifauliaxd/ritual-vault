import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username } = req.body;
  const currentWeek = process.env.CURRENT_WEEK_ID;

  if (!username) return res.status(400).json({ error: "Username is required!" });

  const { data, error } = await supabase
    .from('submissions')
    .insert([
      { 
        username, 
        week_id: currentWeek,
        started_at: new Date().toISOString(),
        status: 'playing'
      }
    ])
    .select()
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ sessionId: data.id });
}
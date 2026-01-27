import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  const currentWeek = process.env.CURRENT_WEEK_ID;

  const { data } = await supabase
    .from('submissions')
    .select('username, duration_seconds, finished_at')
    .eq('week_id', currentWeek)
    .eq('status', 'completed')
    .not('finished_at', 'is', null)
    .order('finished_at', { ascending: true })
    .limit(20);

  return res.status(200).json(data || []);
}
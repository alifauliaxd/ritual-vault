import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { sessionId, stage, answer } = req.body;
  
  // Ambil IP
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (ip && ip.includes(',')) ip = ip.split(',')[0].trim();

  const keyMap = {
    1: process.env.LEVEL_1_KEY,
    2: process.env.LEVEL_2_KEY,
    3: process.env.LEVEL_3_KEY
  };

  if (answer?.toUpperCase() === keyMap[stage]?.toUpperCase()) {
    
    if (stage == 3) {
      const { data: sessionData } = await supabase
        .from('submissions')
        .select('started_at, username')
        .eq('id', sessionId)
        .single();

      if (sessionData) {
        // Cek Rate Limit Sekali Lagi (Double Protection)
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        const { data: recent } = await supabase
            .from('submissions')
            .select('id')
            .eq('status', 'completed')
            .neq('id', sessionId)
            .or(`username.eq.${sessionData.username},ip_address.eq.${ip}`)
            .gt('finished_at', oneHourAgo);

        if (recent && recent.length > 0) {
            return res.status(429).json({ 
                success: false, 
                message: "ERROR: Wait for an hour before submitting again." 
            });
        }

        const endTime = new Date();
        const duration = Math.floor((endTime - new Date(sessionData.started_at)) / 1000);

        await supabase
          .from('submissions')
          .update({ 
            status: 'completed', 
            finished_at: endTime.toISOString(),
            duration_seconds: duration,
            ip_address: ip
          })
          .eq('id', sessionId);
      }
    }
    return res.status(200).json({ success: true });
  } 
  
  return res.status(400).json({ success: false });
}
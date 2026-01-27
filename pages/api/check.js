import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { sessionId, stage, answer } = req.body;

  const keyMap = {
    1: process.env.LEVEL_1_KEY,
    2: process.env.LEVEL_2_KEY,
    3: process.env.LEVEL_3_KEY
  };

  const correctAnswer = keyMap[stage];

  if (answer.toUpperCase() === correctAnswer?.toUpperCase()) {
    
    if (stage == 3) {
      
      const { data: sessionData } = await supabase
        .from('submissions')
        .select('started_at')
        .eq('id', sessionId)
        .single();

      if (sessionData) {
        const endTime = new Date();
        const startTime = new Date(sessionData.started_at);
        
        const duration = Math.floor((endTime - startTime) / 1000);

        await supabase
          .from('submissions')
          .update({ 
            status: 'completed', 
            finished_at: endTime.toISOString(),
            duration_seconds: duration
          })
          .eq('id', sessionId);
      }
    }

    return res.status(200).json({ success: true });
  } 
  
  return res.status(400).json({ success: false });
}
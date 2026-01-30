export default function handler(req, res) {
  // Matikan caching biar browser selalu request baru
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  
  // --- INI RAHASIANYA ---
  // Kita selipkan password di Header dengan nama 'x-ritual-secret'
  // Pastikan value ini SAMA dengan process.env.LEVEL_2_KEY kamu di .env
  res.setHeader('x-ritual-secret', 'S1ggy_Runs_Inf3rnet'); 
  
  // Response body cuma pengalihan isu
  res.status(200).json({ 
    message: "The truth is not here. Look above.",
    hint: "Inspect the Response Headers."
  });
}
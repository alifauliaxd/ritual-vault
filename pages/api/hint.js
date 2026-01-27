export default function handler(req, res) {
  res.setHeader('Secret-Password', 'S1ggy_Runs_Inf3rnet');
  
  res.status(200).json({ 
    message: "Nothing to see here. Check the HEADERS above.",
    hint: "Look for 'Secret-Password'" 
  }); 
}
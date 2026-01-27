import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function PlayStage() {
  const router = useRouter();
  const { stage } = router.query;
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, success: false, msg: '' });

  // --- PERBAIKAN LOGIC SATPAM (STRICT MODE) ---
  useEffect(() => {
    // 1. Cek Sesi Login
    if (!localStorage.getItem('vault_session')) {
      router.push('/');
      return;
    }

    if (stage) {
      const unlockedLevel = parseInt(localStorage.getItem('vault_level') || '1');
      const targetStage = parseInt(stage);

      // 2. Cek Apakah Sudah Tamat? (Level > 3)
      // Kalau sudah tamat, dilarang masuk play lagi -> Lempar ke Leaderboard
      if (unlockedLevel > 3) {
        router.push('/leaderboard');
        return;
      }

      // 3. Strict Mode (Dilarang Maju ATAU Mundur)
      // Kalau level user 2, dia HARUS di /play/2.
      // Kalau dia coba ke /play/1 (Mundur) atau /play/3 (Maju) -> Balikin ke Level Asli
      if (targetStage !== unlockedLevel) {
        router.push(`/play/${unlockedLevel}`);
      }
    }
  }, [stage]);

  useEffect(() => { if (stage == 2) fetch('/api/hint'); }, [stage]);
  useEffect(() => { if (stage == 3) document.cookie = "vault_secret=UHVycmlmaWFibDNfQzBtcHV0ZQ==; path=/"; }, [stage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const sessionId = localStorage.getItem('vault_session');

    try {
      const res = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, stage, answer })
      });
      const data = await res.json();

      if (data.success) {
        setModal({ show: true, success: true, msg: "ACCESS GRANTED. LOADING NEXT MODULE..." });
        
        setTimeout(() => {
          const currentStage = parseInt(stage);
          const nextStage = currentStage + 1;

          const unlockedLevel = parseInt(localStorage.getItem('vault_level') || '1');
          if (nextStage > unlockedLevel) {
            localStorage.setItem('vault_level', nextStage.toString());
          }

          if (currentStage === 3) {
            router.push('/leaderboard');
          } else {
            router.push(`/play/${nextStage}`);
            setAnswer('');
            setModal({ show: false, success: false, msg: '' });
            
            setLoading(false);
          }
        }, 1000);
      } else {
        setModal({ show: true, success: false, msg: "ACCESS DENIED. INVALID CREDENTIALS." });
        setLoading(false);
      }
    } catch (err) {
      alert("Network Error");
      setLoading(false);
    }
  };

  if (!stage) return <div className="p-10 text-[#00ff41]">LOADING...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative text-[#00ff41]">
      
      <div className="absolute top-0 left-0 p-4 text-xs text-gray-500 font-mono">
        RITUAL VAULT // STAGE 0{stage}
      </div>

      <h1 className="text-4xl font-bold mb-4 animate-pulse text-white">SECURITY LEVEL {stage}</h1>

      <p className="mb-8 text-center max-w-md border-l-2 border-[#00ff41] pl-4 text-sm font-mono text-gray-300">
        {stage == 1 && "> CLUE: THE SURFACE IS A LIE. INSPECT THE SKELETON OF THIS REALITY."}
        {stage == 2 && "> CLUE: INVISIBLE WHISPERS FLOW IN THE NETWORK. LISTEN TO THE HEADERS."}
        {stage == 3 && "> CLUE: A DIGITAL CRUMB REMAINS. DECODE THE ENCRYPTED MEMORY."}
      </p>

      {stage == 1 && <div style={{ display: 'none' }} id="secret-clue">PASSWORD: Summ0n_The_B1ack_Cat</div>}

      <form onSubmit={handleSubmit} className="flex gap-2 bg-black/50 p-2 rounded border border-[#00ff41]/50 items-center backdrop-blur-sm">
        <input 
          type="text" 
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="ENTER PASSWORD"
          className="p-3 bg-black text-[#00ff41] border border-[#00ff41] font-bold outline-none w-64 placeholder-gray-700"
          autoComplete="off"
        />
        <button disabled={loading} className="bg-[#00ff41] text-black px-6 py-3 font-bold hover:bg-white transition-colors border border-[#00ff41]">
          {loading ? "..." : "UNLOCK"}
        </button>
      </form>

      {modal.show && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] backdrop-blur-sm">
          <div className="border-4 border-[#00ff41] bg-[#0a0a0a] p-12 max-w-lg w-full text-center terminal-alert relative shadow-[0_0_50px_rgba(0,255,65,0.4)]">
            <h2 className={`text-2xl font-bold mb-4 border-b border-[#00ff41] pb-2 ${modal.success ? 'text-[#00ff41]' : 'text-red-500'}`}>
              {modal.success ? "SYSTEM OVERRIDE" : "SECURITY ALERT"}
            </h2>
            <p className="mb-6 text-lg text-white font-mono">{modal.msg}</p>
            {!modal.success && (
              <button 
                onClick={() => setModal({ ...modal, show: false })}
                className="border border-red-500 text-red-500 px-6 py-2 hover:bg-red-500 hover:text-black w-full font-bold transition-all"
              >
                ACKNOWLEDGE
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
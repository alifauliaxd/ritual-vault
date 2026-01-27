import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem('vault_session');
    localStorage.removeItem('vault_username');
    localStorage.removeItem('vault_level');
  }, []);

  const handleStart = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('vault_session', data.sessionId);
      localStorage.setItem('vault_username', username);

      localStorage.setItem('vault_level', '1');
      
      router.push('/play/1'); 
    } else {
      alert("SYSTEM ERROR: " + data.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      <div className="border border-[#00ff41] p-8 w-full max-w-2xl bg-black/80 backdrop-blur-sm relative z-10 shadow-[0_0_20px_rgba(0,255,65,0.2)]">
        
        <div className="flex flex-col items-center mb-8 border-b border-[#00ff41] pb-6">
          <div className="flex flex-row items-center justify-center gap-3">
            <img 
              src="/logo.png" 
              alt="Ritual Logo" 
              style={{ width: '50px', height: '50px' }} 
              className="object-contain drop-shadow-[0_0_10px_#00ff41]" 
            />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter animate-pulse m-0 leading-none pt-2">
            RITUAL VAULT
            </h1>
          </div>
          <p className="text-xs tracking-[0.3em] text-[#00ff41]/70 mt-3 text-center">
            SECURE WEEKLY PROTOCOL
          </p>
        </div>

        <div className="text-sm mb-6 font-mono space-y-2">
          <p className="text-[#00ff41]">&gt; SYSTEM CHECK... <span className="text-white">OK</span></p>
          <p className="text-[#00ff41]">&gt; DATABASE CONNECTION... <span className="text-white">SECURE</span></p>
          <p className="animate-pulse text-white mt-4">&gt; PLEASE IDENTIFY YOURSELF:</p>
        </div>

        <form onSubmit={handleStart} className="flex flex-col gap-4">
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ENTER USERNAME"
            className="p-4 bg-black border border-[#00ff41] text-center text-xl uppercase font-bold tracking-widest text-[#00ff41] focus:shadow-[0_0_15px_#00ff41] placeholder-gray-800 outline-none"
            required
            maxLength={15}
          />
          
          <button 
            disabled={loading}
            className="bg-[#00ff41] text-black py-4 font-bold hover:bg-white transition-colors uppercase tracking-widest border border-transparent hover:border-[#00ff41]"
          >
            {loading ? "AUTHENTICATING..." : "ACCESS SYSTEM"}
          </button>
        </form>
      </div>

      <div className="mt-8 text-[10px] text-gray-500 font-mono text-center">
        <p>COPYRIGHT © 2026 Made with Love for RITUAL COMMUNITY.</p>
      </div>
    </div>
  );
}
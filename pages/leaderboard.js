import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // Tambah Router

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true); // Tambah state loading
  const router = useRouter();

  const fetchLeaderboard = () => {
    setLoading(true);
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        setScores(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Helper warna ranking
  const getRankColor = (i) => {
    if (i === 0) return "text-yellow-400"; // Emas
    if (i === 1) return "text-gray-300";   // Perak
    if (i === 2) return "text-orange-400"; // Perunggu
    return "text-[#00ff41]";
  };

  return (
    <div className="min-h-screen bg-black text-[#00ff41] p-8 flex flex-col items-center">
      <h1 className="text-5xl font-bold mb-8 text-white">🏆 HALL OF FAME</h1>
      
      <div className="w-full max-w-2xl border border-[#00ff41] relative">
        <table className="w-full text-left">
          <thead className="bg-[#111] text-white">
            <tr>
              <th className="p-4">RANK</th>
              <th className="p-4">HACKER</th>
              <th className="p-4">TIME (SPEED)</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan="3" className="p-8 text-center animate-pulse">DECRYPTING...</td></tr>
            ) : scores.length === 0 ? (
                <tr><td colSpan="3" className="p-8 text-center text-gray-500">NO DATA FOUND</td></tr>
            ) : (
                scores.map((s, i) => (
                  <tr key={i} className="border-t border-gray-800 hover:bg-[#111]">
                    <td className={`p-4 font-bold text-xl ${getRankColor(i)}`}>
                        #{i + 1} {i === 0 && "👑"}
                    </td>
                    <td className="p-4 text-white">{s.username}</td>
                    <td className="p-4 font-mono">
                      {Math.floor(s.duration_seconds / 60)}m {s.duration_seconds % 60}s
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Ganti a href jadi router.push biar smooth */}
      <button onClick={() => router.push('/')} className="mt-8 underline text-gray-500 hover:text-white">
        Back to Home
      </button>
    </div>
  );
}
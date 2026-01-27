import { useEffect, useState } from 'react';

export default function Leaderboard() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    // Ambil data leaderboard
    fetch('/api/leaderboard').then(res => res.json()).then(data => setScores(data));
  }, []);

  return (
    <div className="min-h-screen bg-black text-[#00ff41] p-8 flex flex-col items-center">
      <h1 className="text-5xl font-bold mb-8 text-white">🏆 HALL OF FAME</h1>
      
      <div className="w-full max-w-2xl border border-[#00ff41]">
        <table className="w-full text-left">
          <thead className="bg-[#111] text-white">
            <tr>
              <th className="p-4">RANK</th>
              <th className="p-4">HACKER</th>
              <th className="p-4">TIME (SPEED)</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s, i) => (
              <tr key={i} className="border-t border-gray-800 hover:bg-[#111]">
                <td className="p-4 font-bold text-xl">#{i + 1}</td>
                <td className="p-4 text-white">{s.username}</td>
                {/* Konversi detik ke format Menit:Detik */}
                <td className="p-4 font-mono">
                  {Math.floor(s.duration_seconds / 60)}m {s.duration_seconds % 60}s
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <a href="/" className="mt-8 underline text-gray-500 hover:text-white">Back to Home</a>
    </div>
  );
}
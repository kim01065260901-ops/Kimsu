
import React, { useState, useCallback } from 'react';
import { Song } from './types';
import { getMusicRecommendations } from './services/geminiService';
import MusicCard from './components/MusicCard';

const App: React.FC = () => {
  const [theme, setTheme] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSongs = useCallback(async (currentTheme: string) => {
    if (!currentTheme.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await getMusicRecommendations(currentTheme);
      setSongs(data.songs);
    } catch (err) {
      setError('음악 추천을 가져오는 데 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRecommend = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSongs(theme);
  };

  const handleReset = () => {
    setSongs([]);
    setTheme('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              M
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900">
              CommuteMelody
            </h1>
          </div>
          {songs.length > 0 && (
            <button 
              onClick={handleReset}
              className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
            >
              초기화
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 pb-24">
        {songs.length === 0 ? (
          <div className="text-center py-20 animate-fadeIn">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-sm font-bold rounded-full mb-6">
              Daily Curation Service
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
              오늘의 출퇴근길을<br />
              <span className="text-blue-600">음악으로 채워보세요.</span>
            </h2>
            <p className="text-gray-500 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
              원하시는 테마나 좋아하는 장르를 알려주세요.<br /> 
              지하철과 버스 안에서 듣기 좋은 7곡을 엄선해 드립니다.
            </p>

            <form onSubmit={handleRecommend} className="relative max-w-md mx-auto">
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="예: 비 오는 날 감성, 신나는 팝, 출근하기 싫을 때"
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none transition-all shadow-xl shadow-gray-100 text-lg"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !theme.trim()}
                className="mt-6 w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:bg-gray-300 disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    큐레이팅 중...
                  </span>
                ) : '추천 목록 받기'}
              </button>
            </form>
          </div>
        ) : (
          <div className="animate-fadeIn">
            <div className="flex items-end justify-between mb-10 border-b border-gray-100 pb-8">
              <div>
                <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">COMMUTE PLAYLIST</span>
                <h2 className="text-3xl font-black text-gray-900 mt-2">"{theme}"를 위한 추천</h2>
                <p className="text-gray-500 mt-1 font-medium">오늘의 추천곡 7선 (K-POP 70% : POP 30%)</p>
              </div>
              <button
                onClick={() => fetchSongs(theme)}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-all border border-gray-200"
              >
                <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                재추천 받기
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {songs.map((song, index) => (
                <MusicCard key={`${song.title}-${index}`} song={song} index={index} />
              ))}
            </div>

            <footer className="mt-16 text-center text-gray-400 text-sm">
              <p>© 2024 CommuteMelody. 모든 추천은 AI를 기반으로 생성됩니다.</p>
            </footer>
          </div>
        )}
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;

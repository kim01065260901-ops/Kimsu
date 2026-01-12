
import React, { useState, useCallback } from 'react';
import { Song, UserPreferences } from './types';
import { getMusicRecommendations } from './services/geminiService';
import MusicCard from './components/MusicCard';
import PreferenceForm from './components/PreferenceForm';

const App: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activePrefs, setActivePrefs] = useState<UserPreferences | null>(null);

  const fetchSongs = useCallback(async (prefs: UserPreferences) => {
    setLoading(true);
    setError(null);
    setActivePrefs(prefs);
    try {
      const data = await getMusicRecommendations(prefs);
      setSongs(data.songs);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError('개인화된 음악 추천을 가져오는 데 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReset = () => {
    setSongs([]);
    setActivePrefs(null);
    setError(null);
  };

  const handleReRecommend = () => {
    if (activePrefs) {
      fetchSongs(activePrefs);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-blue-100">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-inner">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h1 className="text-xl font-black tracking-tight text-gray-900">
              CommuteMelody
            </h1>
          </div>
          {songs.length > 0 && (
            <button 
              onClick={handleReset}
              className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50"
            >
              다시 설정하기
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 pb-24">
        {songs.length === 0 ? (
          <div className="animate-fadeIn">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 bg-blue-50 text-blue-600 text-xs font-black rounded-full mb-4 uppercase tracking-widest">
                Personalized AI Curation
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
                당신만을 위한<br />
                <span className="text-blue-600">출퇴근 메이트</span>
              </h2>
              <p className="text-gray-400 text-lg font-medium max-w-lg mx-auto leading-relaxed">
                몇 가지 질문을 통해 당신의 음악 취향을 파악합니다.<br />
                지루한 이동 시간을 특별한 감동으로 바꿔보세요.
              </p>
            </div>

            <PreferenceForm onSubmit={fetchSongs} loading={loading} />
          </div>
        ) : (
          <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-gray-50 pb-10">
              <div>
                <span className="text-blue-600 font-black uppercase tracking-widest text-[10px]">Your Daily Mix</span>
                <h2 className="text-3xl font-black text-gray-900 mt-2">오늘의 맞춤 플레이리스트</h2>
                <div className="flex flex-wrap gap-2 mt-4">
                  {activePrefs?.genres.map(g => (
                    <span key={g} className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-bold rounded-lg border border-gray-100">#{g}</span>
                  ))}
                  {activePrefs?.vibe && (
                    <span className="px-3 py-1 bg-blue-50 text-blue-500 text-xs font-bold rounded-lg border border-blue-100">#{activePrefs.vibe}</span>
                  )}
                </div>
              </div>
              
              <button
                onClick={handleReRecommend}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-2xl font-black text-sm hover:bg-gray-50 transition-all border-2 border-gray-100 shadow-sm whitespace-nowrap"
              >
                <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {loading ? '생성 중...' : '이 취향으로 다시 추천받기'}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-5 rounded-2xl mb-8 text-sm font-bold flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <div className="space-y-6">
              {songs.map((song, index) => (
                <MusicCard key={`${song.title}-${index}`} song={song} index={index} />
              ))}
            </div>

            <footer className="mt-20 py-10 border-t border-gray-50 text-center">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Powered by Gemini AI</p>
              <p className="text-gray-300 text-[10px] mt-2 leading-relaxed">
                CommuteMelody는 사용자의 취향을 분석하여 매일 새로운 음악을 추천합니다.<br />
                모든 권리는 해당 아티스트와 저작권자에게 있습니다.
              </p>
            </footer>
          </div>
        )}
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;

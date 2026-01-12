
import React, { useState } from 'react';
import { UserPreferences } from '../types';

interface PreferenceFormProps {
  onSubmit: (prefs: UserPreferences) => void;
  loading: boolean;
}

const genres = ['K-Pop', '발라드', '인디', '힙합/R&B', '록/밴드', '댄스', '재즈', '클래식'];
const eras = ['최신곡', '2010년대', '2000년대', '90년대 이전'];
const vibes = ['차분하고 정적인', '활기차고 신나는', '집중이 잘되는', '감성적인', '비 오는 날 분위기'];

const PreferenceForm: React.FC<PreferenceFormProps> = ({ onSubmit, loading }) => {
  const [prefs, setPrefs] = useState<UserPreferences>({
    genres: [],
    eras: [],
    vibe: '',
    extraInfo: ''
  });

  const toggleItem = (category: keyof UserPreferences, value: string) => {
    setPrefs(prev => {
      const current = prev[category] as string[];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(item => item !== value) };
      }
      return { ...prev, [category]: [...current, value] };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(prefs);
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fadeIn max-w-2xl mx-auto space-y-10">
      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">1</span>
          선호하는 장르를 선택해주세요
        </h3>
        <div className="flex flex-wrap gap-2">
          {genres.map(genre => (
            <button
              key={genre}
              type="button"
              onClick={() => toggleItem('genres', genre)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                prefs.genres.includes(genre)
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-blue-200'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">2</span>
          좋아하는 시대를 선택해주세요
        </h3>
        <div className="flex flex-wrap gap-2">
          {eras.map(era => (
            <button
              key={era}
              type="button"
              onClick={() => toggleItem('eras', era)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                prefs.eras.includes(era)
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-blue-200'
              }`}
            >
              {era}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">3</span>
          오늘 출퇴근길의 무드는 어떤가요?
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {vibes.map(vibe => (
            <button
              key={vibe}
              type="button"
              onClick={() => setPrefs({ ...prefs, vibe })}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border text-left ${
                prefs.vibe === vibe
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-blue-200'
              }`}
            >
              {vibe}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">4</span>
          더 자세한 취향을 알려주세요 (선택)
        </h3>
        <textarea
          value={prefs.extraInfo}
          onChange={(e) => setPrefs({ ...prefs, extraInfo: e.target.value })}
          placeholder="좋아하는 아티스트나 특정 상황을 적어주세요. (예: 뉴진스 스타일, 졸릴 때 잠 깨는 노래)"
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all h-24 resize-none text-sm"
        />
      </section>

      <button
        type="submit"
        disabled={loading || (prefs.genres.length === 0 && !prefs.vibe)}
        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-black transition-all transform hover:-translate-y-1 disabled:bg-gray-200 disabled:transform-none shadow-xl shadow-gray-200"
      >
        {loading ? '당신의 취향을 분석 중...' : '맞춤 플레이리스트 생성'}
      </button>
    </form>
  );
};

export default PreferenceForm;


import React from 'react';
import { Song } from '../types';

interface MusicCardProps {
  song: Song;
  index: number;
}

const MusicCard: React.FC<MusicCardProps> = ({ song, index }) => {
  const searchQuery = encodeURIComponent(`${song.artist} ${song.title}`);
  const youtubeUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;

  return (
    <div 
      className="group flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 animate-fadeIn mb-4"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
            song.category === 'Korean' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
          }`}>
            {song.category}
          </span>
          <span className="text-gray-400 text-sm font-medium">#{index + 1}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {song.title}
        </h3>
        <p className="text-gray-600 font-medium mb-2">{song.artist}</p>
        <p className="text-gray-500 text-sm italic leading-relaxed">
          "{song.reason}"
        </p>
      </div>
      
      <a 
        href={youtubeUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-4 md:mt-0 md:ml-6 flex items-center justify-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-100 whitespace-nowrap"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
        </svg>
        YouTube 감상
      </a>
    </div>
  );
};

export default MusicCard;

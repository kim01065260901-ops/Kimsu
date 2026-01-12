
export interface UserPreferences {
  genres: string[];
  eras: string[];
  vibe: string;
  extraInfo: string;
}

export interface Song {
  title: string;
  artist: string;
  reason: string;
  category: 'Korean' | 'Foreign';
}

export interface RecommendationResponse {
  songs: Song[];
}

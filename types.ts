
export interface Song {
  title: string;
  artist: string;
  reason: string;
  category: 'Korean' | 'Foreign';
}

export interface RecommendationResponse {
  songs: Song[];
}

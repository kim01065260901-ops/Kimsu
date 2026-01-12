
import { GoogleGenAI, Type } from "@google/genai";
import { RecommendationResponse, UserPreferences } from "../types";

export const getMusicRecommendations = async (preferences: UserPreferences): Promise<RecommendationResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `Act as an expert personalized music curator. Create a 7-song commute playlist based on this user profile:
  - Favorite Genres: ${preferences.genres.join(', ')}
  - Preferred Eras: ${preferences.eras.join(', ')}
  - Commute Vibe: ${preferences.vibe}
  - Additional Info: ${preferences.extraInfo}

  Strict Requirements:
  1. Total 7 songs.
  2. Ratio: 5 Korean songs (K-Pop/Indie/etc.) and 2 Foreign/International songs.
  3. Tailor the selections to the commute environment (subway/bus).
  4. Provide a brief, personalized reason for each song choice based on their preferences.
  5. Respond ONLY in valid JSON format.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            songs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  artist: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  category: { type: Type.STRING, enum: ['Korean', 'Foreign'] }
                },
                required: ['title', 'artist', 'reason', 'category']
              }
            }
          },
          required: ['songs']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    return JSON.parse(text) as RecommendationResponse;
  } catch (error) {
    console.error("Error fetching personalized recommendations:", error);
    throw error;
  }
};

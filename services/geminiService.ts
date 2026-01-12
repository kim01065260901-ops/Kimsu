
import { GoogleGenAI, Type } from "@google/genai";
import { RecommendationResponse } from "../types";

export const getMusicRecommendations = async (theme: string): Promise<RecommendationResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `Act as a professional music curator. The user wants music recommendations for their commute (subway or bus) based on the theme or genre: "${theme}". 
  Provide exactly 7 song recommendations. 
  Follow these strict rules:
  1. Return exactly 5 Korean songs and 2 Foreign (International) songs.
  2. For each song, provide the title, artist, a short reason why it fits the commute, and the category ('Korean' or 'Foreign').
  3. Respond only in valid JSON format.`;

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
    console.error("Error fetching recommendations:", error);
    throw error;
  }
};

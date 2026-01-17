import { GoogleGenAI } from "@google/genai";
import { Platform } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing in process.env");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generatePostContent = async (
  topic: string, 
  platform: Platform
): Promise<{ content: string; hashtags: string[] }> => {
  const ai = getAiClient();
  if (!ai) {
    return { 
      content: "Error: API Key missing. Please configure your environment.", 
      hashtags: [] 
    };
  }

  const prompt = `
    Create a social media post for ${platform} about the topic: "${topic}".
    The tone should be professional yet engaging.
    Also provide 5 relevant hashtags.
    Return the response as a valid JSON object with the keys "content" (string) and "hashtags" (array of strings).
    Do not include markdown code blocks.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const parsed = JSON.parse(text);
    return {
      content: parsed.content || "",
      hashtags: parsed.hashtags || []
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      content: "Failed to generate content. Please try again.",
      hashtags: []
    };
  }
};

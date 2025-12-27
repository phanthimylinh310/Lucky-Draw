
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTeamNames = async (count: number): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate ${count} creative, professional, and fun corporate team names. Return only a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini Error:", error);
    return Array.from({ length: count }, (_, i) => `第 ${i + 1} 組`);
  }
};

export const generateCongratulation = async (winnerName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `寫一段簡短、熱情且幽默的恭喜詞給抽中大獎的員工 "${winnerName}"。不超過30字。`,
    });
    return response.text.trim();
  } catch (error) {
    return `恭喜 ${winnerName} 獲得大獎！太幸運了！`;
  }
};

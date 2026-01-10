import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  const apiKey = process.env.API_KEY || '';
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will fallback to mock data.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateTeamNames = async (count: number): Promise<string[]> => {
  const ai = getAIClient();
  if (!ai) {
    // Return mock data if no API key
    return Array.from({ length: count }, (_, i) => `Team ${String.fromCharCode(65 + i)}`);
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `Generate ${count} creative, professional, and fun corporate team names. Return only a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    // Handle response text safely
    const text = response.text ? response.text() : "";
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini Error:", error);
    return Array.from({ length: count }, (_, i) => `Team ${String.fromCharCode(65 + i)}`);
  }
};

export const generateCongratulation = async (winnerName: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) {
    return `恭喜 ${winnerName} 獲得大獎！`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `寫一段簡短、熱情且幽默的恭喜詞給抽中大獎的員工 "${winnerName}"。不超過30字。`,
    });
    return response.text ? response.text().trim() : `恭喜 ${winnerName}！`;
  } catch (error) {
    return `恭喜 ${winnerName} 獲得大獎！太幸運了！`;
  }
};

import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getCourseRecommendations(interests: string[], language: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `Based on these interests: ${interests.join(", ")} and preferred language: ${language}, suggest 3 practical skill-based course categories that would empower a local community. Provide a brief reason for each. Return as a JSON array of objects with 'category' and 'reason'.`;
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini recommendation error:", error);
    return [];
  }
}

export async function getChatbotResponse(history: ChatMessage[], message: string) {
  const model = "gemini-3-flash-preview";
  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction: "You are BharatSkillConnect Assistant. You help users find practical skill-based courses in regional languages. Be helpful, encouraging, and concise. If asked about courses, mention that we offer modules in Agriculture, Tailoring, Basic Coding, and Digital Literacy.",
    },
  });

  // Convert history to Gemini format
  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  try {
    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Gemini chatbot error:", error);
    return "I'm sorry, I'm having trouble connecting right now. How else can I help you with your skills?";
  }
}

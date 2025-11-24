import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateExplanation = async (topic: string, context: string): Promise<string> => {
  if (!apiKey) return "API Key 未配置，无法获取解释。";

  try {
    const prompt = `
      你是一位资深的 GPU 工程师和计算机科学教授。
      请结合 GPU 架构和图形编程的背景，用中文解释 "${topic}" 的概念。
      
      当前应用上下文：${context}
      
      要求：
      1. 保持简洁（150字以内）。
      2. 如果概念复杂，请使用类比。
      3. 如果相关，请提及它与 CPU 的区别。
      4. 使用 Markdown 格式。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "未能生成解释。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "连接 AI 知识库时出错。";
  }
};

export const chatWithExpert = async (message: string, history: { role: string; text: string }[]): Promise<string> => {
  if (!apiKey) return "缺少 API Key。";

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      })),
      config: {
        systemInstruction: "你叫 GPU-GPT，是一个专门负责教授 GPU 架构、CUDA/OpenCL 概念和图形渲染管线的中文助手。你的回答需要技术性强但通俗易懂。如果只需，可以使用简单的代码片段 (GLSL/C++)。",
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text || "我没听清，请再说一遍。";
  } catch (error) {
    console.error("Chat Error:", error);
    return "我现在无法处理该请求，请稍后再试。";
  }
};
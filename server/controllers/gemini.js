// controllers/gemini.js
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const askGemini = async (req, res) => {
  try {
    const { query, prompt } = req.body;
    const promptText = (query ?? prompt ?? '').toString();
    if (!promptText) {
      return res.status(400).json({ error: 'Query or prompt is required' });
    }

    const response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          parts: [{ text: promptText }],
        },
      ],
    });

    const text = response.text ?? 'No response from Gemini API';
    return res.json({ text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Failed to get response from Gemini.' });
  }
};

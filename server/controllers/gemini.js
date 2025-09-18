// controllers/gemini.js
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

function sanitizeGeminiText(text) {
  if (!text) return '';
  let t = String(text);
  // Remove fenced code blocks
  t = t.replace(/```[\s\S]*?```/g, '');
  // Remove common markdown artifacts and excessive symbols
  t = t.replace(/[\*`#_>]+/g, '');
  // Normalize dashes and bullets
  t = t.replace(/\n\s*[-•]\s*/g, '\n• ');
  // Collapse multiple blank lines
  t = t.replace(/\n{3,}/g, '\n\n');
  // Trim whitespace
  t = t.trim();
  return t;
}

function extractStructuredJson(text) {
  if (!text) return null;
  const raw = String(text);
  // Try to find a JSON object at the end of the response (non-greedy, last block)
  const match = raw.match(/\{[\s\S]*?\}\s*$/m);
  if (!match) return null;
  try {
    const obj = JSON.parse(match[0]);
    return obj;
  } catch (_) {
    return null;
  }
}

function removeTrailingJson(text) {
  if (!text) return '';
  return String(text).replace(/\{[\s\S]*?\}\s*$/m, '').trim();
}

export const askGemini = async (req, res) => {
  try {
    const { query, prompt, coords, floatId } = req.body;
    const promptText = (query ?? prompt ?? '').toString();
    if (!promptText) {
      return res.status(400).json({ error: 'Query or prompt is required' });
    }

    const systemInstructions = [
      'You are an assistant for an ARGO oceanography dashboard.',
      'Task: Provide concise insights strictly relevant to ARGO float/profile data and local ocean context.',
      'Return plain text only. No markdown, asterisks, code blocks, headings, or tables.',
      'When possible, include concrete numeric values and units for key metrics.',
      'Prioritize: temperature (TEMP, °C), salinity (PSAL, PSU), pressure/depth (PRES, dbar or m), and profile structure.',
      'Finish with 3-6 short bullet lines listing numeric highlights (e.g., Temp range: 28–24 °C; Surface PSAL: 34.8 PSU; MLD: ~40 m).',
      `Additionally, at the very end, output a single JSON object on its own line with keys: { "temp_c": number | {"min": number, "max": number}, "salinity_psu": number | {"min": number, "max": number}, "depth_m": number | {"min": number, "max": number}, "plankton_density_cells_ml": number | {"min": number, "max": number} } and DO NOT wrap it in markdown or any extra text. Plain JSON only.`
    ].join(' ');

    const locationHint = coords && typeof coords === 'object'
      ? `Approximate location: lat ${coords.lat}, lon ${coords.lon}. `
      : '';

    const floatHint = floatId ? `Float identifier: ${floatId}. ` : '';

    const finalPrompt = [
      systemInstructions,
      locationHint + floatHint,
      `User query: ${promptText}`,
      'Important: respond with plain sentences, then a short numeric highlights list using hyphen bullets. No special symbols.',
      'Then output the JSON object described above on the last line.'
    ].filter(Boolean).join('\n\n');

    const response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          parts: [{ text: finalPrompt }],
        },
      ],
    });

    const rawText = response.text ?? 'No response from Gemini API';
    const json = extractStructuredJson(rawText);
    const rawWithoutJson = removeTrailingJson(rawText);
    const text = sanitizeGeminiText(rawWithoutJson);
    return res.json({ text, json });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Failed to get response from Gemini.' });
  }
};

import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
async function callDeepSeek(symptomRecord) {
  if (!DEEPSEEK_KEY) throw new Error('No DeepSeek key');
  const prompt = buildPrompt(symptomRecord);
  const resp = await axios.post('https://api.deepseek.com/v1/chat/completions', { model: 'deepseek-r1', messages:[{role:'user',content:prompt}], temperature:0.0, max_tokens:500 }, { headers:{ Authorization: `Bearer ${DEEPSEEK_KEY}` }});
  const text = resp.data.choices?.[0]?.message?.content || '';
  return parseLLMOutputToCandidates(text);
}
async function callGemini(symptomRecord) {
  if (!GEMINI_KEY) throw new Error('No Gemini key');
  const prompt = buildPrompt(symptomRecord);
  const resp = await axios.post('https://api.generativeai.googleapis.com/v1beta2/models/gemini-1.5:generate', { prompt:{ text: prompt }, temperature:0.0, maxOutputTokens:512 }, { headers:{ Authorization: `Bearer ${GEMINI_KEY}` }});
  const text = resp.data.candidates?.[0]?.output ?? '';
  return parseLLMOutputToCandidates(text);
}
function buildPrompt(record) {
  const symptoms = record.symptoms.join(', ');
  const allergies = (record.allergies || []).join(', ') || 'none';
  const meds = (record.currentMedications || []).join(', ') || 'none';
  const age = record.age || 'unknown';
  return `You are a clinical decision support assistant. Given the following de-identified patient info, suggest up to 5 likely medicines (not diagnoses). Return output as JSON array: [{"name":"", "score":<0-1>, "reason":""},...] Patient: age: ${age}; symptoms: ${symptoms}; allergies: ${allergies}; currentMedications: ${meds}. Only suggest generic medicine names. Do not print PHI.`;
}
function parseLLMOutputToCandidates(text) {
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed.map(p => ({ name: p.name, score: p.score || 1, reason: p.reason || '' }));
  } catch (e) {
    const lines = text.split('\n').slice(0,10);
    const cand = lines.map(l => {
      const match = l.match(/([A-Za-z0-9\-\s]+)/);
      if (match) return { name: match[1].trim(), score: 0.5, reason: 'parsed fallback' };
    }).filter(Boolean);
    return cand;
  }
  return [];
}
export async function callLLMForSuggestions(record) {
  if (DEEPSEEK_KEY) return await callDeepSeek(record);
  if (GEMINI_KEY) return await callGemini(record);
  throw new Error('No LLM key configured');
}

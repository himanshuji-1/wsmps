import express from 'express';
import Symptom from '../models/Symptom.js';
import Medicine from '../models/Medicine.js';
import { basicRuleEngine } from '../utils/ruleEngine.js';
import { callLLMForSuggestions } from '../utils/llmClient.js';
import { requireAuth } from '../middleware.js';
const router = express.Router();
router.post('/', requireAuth, async (req, res) => {
  try {
    const { symptomRecordId, useLLM = false } = req.body;
    const record = await Symptom.findById(symptomRecordId);
    if (!record) return res.status(404).json({ message: 'Symptom record not found' });
    const ruleResults = await basicRuleEngine(record);
    let llmResults = [];
    if (useLLM) {
      try { llmResults = await callLLMForSuggestions(record); } catch (e) { console.warn('LLM failed:', e.message); }
    }
    const merged = new Map();
    const pushCandidate = (c, source) => {
      const key = c.name.toLowerCase();
      if (!merged.has(key)) merged.set(key, { name: c.name, score: 0, reasons: [], source: new Set() });
      const entry = merged.get(key);
      entry.score += (c.score || 1);
      if (c.reason) entry.reasons.push(c.reason);
      entry.source.add(source);
    };
    ruleResults.forEach(r => pushCandidate(r, 'rule'));
    llmResults.forEach(r => pushCandidate(r, 'llm'));
    const patientAllergies = (record.allergies || []).map(a => a.toLowerCase());
    const patientMeds = (record.currentMedications || []).map(m => m.toLowerCase());
    const patientAge = record.age || null;
    const final = [];
    for (const [k, v] of merged.entries()) {
      const medDoc = await Medicine.findOne({ name: new RegExp(`^${v.name}$`, 'i') });
      const flags = [];
      if (medDoc) {
        for (const a of patientAllergies) {
          if ((medDoc.contraindications || []).map(x=>x.toLowerCase()).includes(a)) {
            flags.push(`Allergy match: ${a}`);
          }
        }
        if (patientAge && medDoc.ageRestrictions) {
          const { min, max } = medDoc.ageRestrictions;
          if ((min && patientAge < min) || (max && patientAge > max)) flags.push('Age restriction');
        }
        for (const pm of patientMeds) {
          if ((medDoc.interactions || []).map(x=>x.toLowerCase()).includes(pm)) {
            flags.push(`Interacts with ${pm}`);
          }
        }
      }
      final.push({ name: v.name, score: v.score, reasons: v.reasons, sources: Array.from(v.source), blocked: flags.length>0, flags });
    }
    final.sort((a,b)=>b.score-a.score);
    res.json({ suggestions: final });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Suggestions failed' });
  }
});
export default router;

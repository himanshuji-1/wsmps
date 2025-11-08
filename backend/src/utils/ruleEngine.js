import Medicine from '../models/Medicine.js';
export async function basicRuleEngine(symptomRecord) {
  const symptoms = (symptomRecord.symptoms || []).map(s => s.toLowerCase());
  const meds = await Medicine.find({});
  const results = [];
  meds.forEach(m => {
    const indications = (m.indications || []).map(i => i.toLowerCase());
    const matched = indications.filter(i => symptoms.includes(i));
    if (matched.length) {
      results.push({ name: m.name, score: matched.length * 2, reason: `Matches symptoms: ${matched.join(', ')}` });
    }
  });
  if (results.length === 0) {
    const fallback = { fever: 'Paracetamol', cough: 'Cough Syrup', 'sore throat': 'Lozenges' };
    symptoms.forEach(s => { if (fallback[s]) results.push({ name: fallback[s], score: 1, reason: 'Fallback mapping' }); });
  }
  return results;
}

import express from 'express';
import Symptom from '../models/Symptom.js';
import { requireAuth } from '../middleware.js';
const router = express.Router();
router.post('/', requireAuth, async (req, res) => {
  try {
    const payload = { patientId: req.user.id, symptoms: req.body.symptoms || [], severity: req.body.severity, duration: req.body.duration, age: req.body.age, notes: req.body.notes, allergies: req.body.allergies || [], currentMedications: req.body.currentMedications || [] };
    const record = await Symptom.create(payload);
    res.status(201).json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to save symptom record' });
  }
});
router.get('/patient/:id', requireAuth, async (req, res) => {
  try {
    const records = await Symptom.find({ patientId: req.params.id }).sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch' });
  }
});
export default router;

import express from 'express';
import Prescription from '../models/Prescription.js';
import Symptom from '../models/Symptom.js';
import generatePrescriptionPDF from '../utils/generatePDF.js';
import { requireAuth } from '../middleware.js';
import User from '../models/User.js';
const router = express.Router();
router.post('/finalize', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') return res.status(403).json({ message: 'Only doctors can finalize' });
    const { symptomRecordId, medicines } = req.body;
    const symptom = await Symptom.findById(symptomRecordId);
    if (!symptom) return res.status(404).json({ message: 'Symptom record not found' });
    const pres = await Prescription.create({ patientId: symptom.patientId, doctorId: req.user.id, symptomRecordId, medicines, finalized: true, signedAt: new Date() });
    const pdfBuffer = await generatePrescriptionPDF({ prescription: pres, symptom, doctorId: req.user.id });
    res.json({ prescription: pres, pdfBase64: pdfBuffer.toString('base64') });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to finalize prescription' });
  }
});
export default router;

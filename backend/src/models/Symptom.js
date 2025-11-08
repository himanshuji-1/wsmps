import mongoose from 'mongoose';
const SymptomSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symptoms: [{ type: String, required: true }],
  severity: { type: String, enum: ['mild','moderate','severe'], default: 'mild' },
  duration: String,
  age: Number,
  notes: String,
  allergies: [{ type: String }],
  currentMedications: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});
const Symptom = mongoose.model('Symptom', SymptomSchema);
export default Symptom;

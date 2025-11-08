import mongoose from 'mongoose';
const PrescriptionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  symptomRecordId: { type: mongoose.Schema.Types.ObjectId, ref: 'Symptom' },
  medicines: [{ medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }, name: String, dose: String, notes: String }],
  finalized: { type: Boolean, default: false },
  signedAt: Date,
  createdAt: { type: Date, default: Date.now }
});
const Prescription = mongoose.model('Prescription', PrescriptionSchema);
export default Prescription;

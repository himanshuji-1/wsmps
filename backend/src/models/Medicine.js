import mongoose from 'mongoose';
const MedicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brandNames: [String],
  indications: [String],
  doseGuidance: String,
  contraindications: [String],
  interactions: [String],
  ageRestrictions: { min: Number, max: Number },
  createdAt: { type: Date, default: Date.now }
});
const Medicine = mongoose.model('Medicine', MedicineSchema);
export default Medicine;

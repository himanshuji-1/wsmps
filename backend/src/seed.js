import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import Medicine from './models/Medicine.js';
async function run() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/wsmps');
  console.log('Mongo connected for seeding');
  const medicines = [
    { name: 'Paracetamol', indications: ['fever','body ache','headache'], doseGuidance: '500 mg every 4-6 hours', contraindications:['liver disease'], interactions:[], ageRestrictions:{min:0} },
    { name: 'Ibuprofen', indications: ['inflammation','pain','fever'], doseGuidance: '200-400 mg every 6-8 hours', contraindications:['peptic ulcer','pregnancy'], interactions:['aspirin'], ageRestrictions:{min:12} },
    { name: 'Cough Syrup', indications: ['cough','sore throat'], doseGuidance: '10 ml twice daily', contraindications:[], interactions:[] }
  ];
  await Medicine.deleteMany({});
  await Medicine.insertMany(medicines);
  console.log('Seed complete');
  process.exit(0);
}
run().catch(err => { console.error(err); process.exit(1); });

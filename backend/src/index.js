console.log("🚀 Starting backend server...");
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import symptomRoutes from './routes/symptoms.js';
import suggestionRoutes from './routes/suggestions.js';
import prescriptionRoutes from './routes/prescriptions.js';
import { errorHandler } from './middleware.js';
dotenv.config();
const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(express.json());
app.get('/', (req, res) => res.send('Backend is running ✅'));
app.use('/auth', authRoutes);
app.use('/symptoms', symptomRoutes);
app.use('/suggestions', suggestionRoutes);
app.use('/prescriptions', prescriptionRoutes);
app.use(errorHandler);
const mongo = process.env.MONGO_URI || 'mongodb://localhost:27017/wsmps';
mongoose.connect(mongo)
  .then(()=> {
    console.log('✅ MongoDB Connected');
    const port = process.env.PORT || 4000;
    app.listen(port, ()=> console.log(`🚀 Server running on port ${port}`));
  })
  .catch(err => console.error('❌ Mongo connection failed:', err));

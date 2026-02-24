import serverless from 'serverless-http';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from '../../server/src/routes/auth.js';
import dogRoutes from '../../server/src/routes/dogs.js';
import healthRoutes from '../../server/src/routes/health.js';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/dogs', dogRoutes);
app.use('/api/dogs', healthRoutes);

const ensureDb = async () => {
  if (mongoose.connection.readyState === 1) return;
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pawsome';
  await mongoose.connect(MONGO_URI);
};

const handler = serverless(app);

export default async function (req, res) {
  try {
    await ensureDb();
  } catch (err) {
    console.error('DB connection error', err);
    res.status(500).json({ message: 'Database connection error' });
    return;
  }

  return handler(req, res);
}

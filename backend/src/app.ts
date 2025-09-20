// app.ts
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import sweetsRoutes from './routes/sweets';

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
console.log('CORS configured for:', FRONTEND_URL);

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetsRoutes);

export default app;

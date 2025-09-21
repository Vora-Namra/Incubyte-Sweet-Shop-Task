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
  origin: [FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5173'], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

console.log('CORS configured for:', FRONTEND_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.json({ 
    message: 'SweetShop API is running!', 
    timestamp: new Date().toISOString(),
    cors: FRONTEND_URL 
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetsRoutes);

app.use((_req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Global error handler:', err);
  res.status(500).json({ message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong' });
});

export default app;
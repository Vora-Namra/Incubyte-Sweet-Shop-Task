import dotenv from 'dotenv';

dotenv.config(); 
import express from 'express';
import { connectDB } from './config/db';
import app from './app';

const PORT = process.env.PORT || 5000;
app.use(express.json());
async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
import mongoose from 'mongoose';

export async function connectDB() {
  const uri = 'mongodb+srv://voranamra625:vCQboWUeonoVChkZ@cluster0.tpmrcqr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');
}


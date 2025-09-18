import express from 'express';
import cors from 'cors';
// import authRoutes from './routes/auth';
// import sweetsRoutes from './routes/sweets';

const app = express();

app.use(cors());
app.use(express.json());

// app.use('/api/auth', authRoutes);
// app.use('/api/sweets', sweetsRoutes);



app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

export default app;

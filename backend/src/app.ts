import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
 import sweetsRoutes from './routes/sweets';

const app = express();

app.use(cors());
app.use(express.json());


app.use(cors({
  origin: "http://localhost:5173", // your frontend URL
  credentials: true, // if using cookies
}));
  app.get('/', (req, res) => {  
  res.send('API is running...');
});
 app.use('/api/auth', authRoutes);
 app.use('/api/sweets', sweetsRoutes);



export default app;

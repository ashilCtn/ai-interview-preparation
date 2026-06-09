import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import sessionRoutes from './routes/session.routes.js';

connectDB();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
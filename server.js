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
app.get('/', (req, res)=>{
    res.send('hello you reached us');
})

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
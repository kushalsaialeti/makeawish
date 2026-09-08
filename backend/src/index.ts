import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cron from 'node-cron';


dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

import memoryRoutes from './routes/memory.routes';
import cmsRoutes from './routes/cms.routes';
import authRoutes from './routes/auth.routes';

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    // Allow any origin
    callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// Keep-alive cron job (every 6 minutes)
// This pings both the backend and frontend to keep them from spinning down
cron.schedule('*/6 * * * *', async () => {
  const backendUrl = process.env.BACKEND_URL || 'https://makeawish-yo9n.onrender.com';
  const frontendUrl = process.env.FRONTEND_URL || 'https://makeawishh.vercel.app';

  console.log(`[Cron] Running keep-alive ping at ${new Date().toISOString()}`);

  try {
    const res = await fetch(`${backendUrl}/`);
    console.log(`[Cron] Backend ping status: ${res.status}`);
  } catch (err) {
    console.error('[Cron] Backend ping failed:', err);
  }

  try {
    const res = await fetch(frontendUrl);
    console.log(`[Cron] Frontend ping status: ${res.status}`);
  } catch (err) {
    console.error('[Cron] Frontend ping failed:', err);
  }
});
// Routes
app.use('/api/memories', memoryRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/auth', authRoutes);

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.send('Make A Wish API is running');
});

// Start Server
app.listen(port, () => {
  console.log(`[MakeAWish] Server running at http://localhost:${port}`);
});


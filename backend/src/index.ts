import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

import memoryRoutes from './routes/memory.routes';
import cmsRoutes from './routes/cms.routes';

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
const KEEPALIVE_INTERVAL = 6 * 60 * 1000; // 6 minutes

setInterval(async () => {
  const backendUrl = process.env.BACKEND_URL || `http://localhost:${port}`;
  const frontendUrl = process.env.FRONTEND_URL;

  try {
    const res = await fetch(`${backendUrl}/`);
    console.log(`[Keepalive] Backend ping status: ${res.status}`);
  } catch (err) {
    console.error('[Keepalive] Backend ping failed:', err);
  }

  if (frontendUrl) {
    try {
      const res = await fetch(frontendUrl);
      console.log(`[Keepalive] Frontend ping status: ${res.status}`);
    } catch (err) {
      console.error('[Keepalive] Frontend ping failed:', err);
    }
  }
}, KEEPALIVE_INTERVAL);
// Routes
app.use('/api/memories', memoryRoutes);
app.use('/api/cms', cmsRoutes);

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.send('Make A Wish API is running');
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

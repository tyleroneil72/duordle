import cors from 'cors';
import { config as dotenvConfig } from 'dotenv';
import express, { Express } from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import path from 'path';
import { errorHandler } from './middleware/errorHandler';
import limiter from './middleware/rateLimitMiddleware';
import roomRouter from './routes/roomRouter';
import wordRouter from './routes/wordRouter';
import { initSocketServer } from './services/socket';

if (process.env.NODE_ENV !== 'test') {
  dotenvConfig({ path: path.join(__dirname, '../../../.env') });
} else {
  dotenvConfig({ path: path.join(__dirname, '../../.env') });
}

const app: Express = express();
const httpServer = createServer(app);
const PORT: number = parseInt(process.env.PORT || '3000', 10);
const CLIENT_URL: string = process.env.CLIENT_URL || 'http://localhost:3000';
const MONGO_URI: string = process.env.MONGO_URI || '';

app.set('trust proxy', 1);

app.use(express.json());
app.use(
  cors({
    origin: CLIENT_URL
  })
);
if (process.env.RATE_LIMIT === 'ON') {
  app.use('/api/room', limiter);
  app.use('/api/word', limiter);
}
app.use('/api/room', roomRouter);
app.use('/api/word', wordRouter);

app.use(express.static(path.join(__dirname, '../../../client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../client/dist', 'index.html'));
});

initSocketServer(httpServer);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  (async () => {
    try {
      await mongoose.connect(MONGO_URI);
      httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      process.exit(1);
    }
  })();
}

export default app;

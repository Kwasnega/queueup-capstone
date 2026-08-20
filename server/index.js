import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import { fileURLToPath, pathToFileURL } from 'node:url';

dotenv.config({ path: fileURLToPath(new URL('.env', import.meta.url)) });

const { Pool } = pg;
const app = express();
const port = Number(process.env.PORT || 5000);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

app.use(cors());
app.use(express.json());

app.get('/api/health', async (_request, response) => {
  try {
    await pool.query('SELECT 1');
    response.status(200).json({ status: 'ok', database: 'connected' });
  } catch (error) {
    console.error('Database health check failed:', error.message);
    response.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

app.get('/', (_request, response) => {
  response.json({ name: 'QUEUEUP API', status: 'running' });
});

const isMainModule = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  app.listen(port, () => {
    console.log(`QUEUEUP API listening on port ${port}`);
  });
}

export { app, pool };

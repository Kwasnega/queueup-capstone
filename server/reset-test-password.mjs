import dotenv from 'dotenv';
import pg from 'pg';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'node:url';

const { Pool } = pg;
dotenv.config({ path: fileURLToPath(new URL('.env', import.meta.url)) });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const hash = await bcrypt.hash('testpass123', 10);
const r = await pool.query('SELECT uid, student_id FROM students LIMIT 2');
console.log('Students:', JSON.stringify(r.rows));
await pool.query('UPDATE students SET password_hash = $1 WHERE uid = $2', [hash, r.rows[0].uid]);
console.log('Password set to testpass123 for', r.rows[0].student_id);
await pool.end();

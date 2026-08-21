import dotenv from 'dotenv';
import pg from 'pg';
import { fileURLToPath } from 'node:url';
import jwt from 'jsonwebtoken';

const { Pool } = pg;
dotenv.config({ path: fileURLToPath(new URL('.env', import.meta.url)) });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Get student data
const r = await pool.query('SELECT uid, student_id, email FROM students LIMIT 2');
const [s1, s2] = r.rows;

// Generate tokens for both students
const token1 = jwt.sign({ uid: s1.uid, studentId: s1.student_id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1h' });
const token2 = jwt.sign({ uid: s2.uid, studentId: s2.student_id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1h' });

console.log('STUDENT1_ID:' + s1.student_id);
console.log('STUDENT2_ID:' + s2.student_id);
console.log('TOKEN1:' + token1);
console.log('TOKEN2:' + token2);

await pool.end();

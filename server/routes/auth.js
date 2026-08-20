import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';

const SALT_ROUNDS = 10;

function createAuthRouter(pool) {
  const router = Router();

  router.post('/signup', async (request, response) => {
    const {
      studentId,
      fullName,
      email,
      password,
      faculty,
      department,
      programme,
      session,
      level
    } = request.body;

    if (!studentId || !password) {
      return response.status(400).json({
        message: 'studentId and password are required'
      });
    }

    try {
      const existingStudent = await pool.query(
        'SELECT student_id, email FROM students WHERE student_id = $1 OR email = $2 LIMIT 1',
        [studentId, email]
      );

      if (existingStudent.rowCount > 0) {
        const duplicate = existingStudent.rows[0];
        const field = duplicate.student_id === studentId ? 'studentId' : 'email';
        return response.status(409).json({
          message: `A student with this ${field} already exists`
        });
      }

      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
      const uid = randomUUID();
      const result = await pool.query(
        `INSERT INTO students
          (student_id, uid, full_name, email, password_hash, faculty, department, programme, session, level)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id, student_id, uid, full_name, email, faculty, department, programme, session, level, created_at`,
        [studentId, uid, fullName, email, passwordHash, faculty, department, programme, session, level]
      );

      return response.status(201).json({
        message: 'Student account created successfully',
        student: result.rows[0]
      });
    } catch (error) {
      if (error.code === '23505') {
        return response.status(409).json({
          message: 'A student with this studentId or email already exists'
        });
      }

      console.error('Signup failed:', error.message);
      return response.status(500).json({ message: 'Unable to create student account' });
    }
  });

  router.post('/login', async (request, response) => {
    const { studentId, password } = request.body;

    if (!studentId || !password) {
      return response.status(400).json({
        message: 'studentId and password are required'
      });
    }

    try {
      const result = await pool.query(
        'SELECT id, student_id, uid, full_name, email, faculty, department, programme, session, level, password_hash FROM students WHERE student_id = $1',
        [studentId]
      );
      const student = result.rows[0];

      if (!student || !(await bcrypt.compare(password, student.password_hash))) {
        return response.status(401).json({ message: 'Invalid student ID or password' });
      }

      if (!process.env.JWT_SECRET) {
        console.error('Login failed: JWT_SECRET is not configured');
        return response.status(500).json({ message: 'Authentication is not configured' });
      }

      const token = jwt.sign(
        { uid: student.uid, studentId: student.student_id, role: 'student' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const { password_hash: _passwordHash, ...profile } = student;
      return response.status(200).json({ token, student: profile });
    } catch (error) {
      console.error('Login failed:', error.message);
      return response.status(500).json({ message: 'Unable to log in' });
    }
  });

  router.post('/admin/login', async (request, response) => {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({
        message: 'email and password are required'
      });
    }

    try {
      const result = await pool.query(
        'SELECT id, uid, full_name, email, role, department, password_hash FROM admins WHERE email = $1',
        [email]
      );
      const admin = result.rows[0];

      if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
        return response.status(401).json({ message: 'Invalid admin email or password' });
      }

      if (!process.env.JWT_SECRET) {
        console.error('Admin login failed: JWT_SECRET is not configured');
        return response.status(500).json({ message: 'Authentication is not configured' });
      }

      const token = jwt.sign(
        {
          uid: admin.uid,
          email: admin.email,
          role: admin.role,
          department: admin.department
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const { password_hash: _passwordHash, ...profile } = admin;
      return response.status(200).json({ token, admin: profile });
    } catch (error) {
      console.error('Admin login failed:', error.message);
      return response.status(500).json({ message: 'Unable to log in as admin' });
    }
  });

  return router;
}

export { createAuthRouter };

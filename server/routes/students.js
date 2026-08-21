import { Router } from 'express';
import { ADMIN_ROLES, authenticateToken, requireRole } from '../middleware/auth.js';
import bcrypt from 'bcrypt';

function createStudentsRouter(pool) {
  const router = Router();

  router.get('/', authenticateToken, requireRole(...ADMIN_ROLES), async (_request, response) => {
    try {
      const result = await pool.query(
        `SELECT id, student_id, uid, full_name, email, faculty, department,
                programme, session, level, semester, created_at
         FROM students
         ORDER BY created_at DESC`
      );

      return response.status(200).json({ students: result.rows });
    } catch (error) {
      console.error('Students lookup failed:', error.message);
      return response.status(500).json({ message: 'Unable to retrieve students' });
    }
  });

  router.get('/me', authenticateToken, requireRole('student'), async (request, response) => {
    try {
      const result = await pool.query(
        `SELECT id, student_id, uid, full_name, email, faculty, department,
          programme, session, level, semester, created_at
         FROM students
         WHERE student_id = $1`,
        [request.user.studentId]
      );

      if (result.rowCount === 0) {
        return response.status(404).json({ message: 'Student profile not found' });
      }

      return response.status(200).json({ student: result.rows[0] });
    } catch (error) {
      console.error('Student profile lookup failed:', error.message);
      return response.status(500).json({ message: 'Unable to retrieve student profile' });
    }
  });

  router.patch('/me', authenticateToken, requireRole('student'), async (request, response) => {
    const {
      full_name: fullName,
      faculty,
      programme,
      department,
      level,
      semester,
      session
    } = request.body;

    try {
      const result = await pool.query(
        `UPDATE students
         SET full_name = $1, faculty = $2, programme = $3, department = $4,
             level = $5, semester = $6, session = $7
         WHERE student_id = $8
         RETURNING id, student_id, uid, full_name, email, faculty, department,
                   programme, session, level, semester, created_at`,
        [fullName, faculty, programme, department, level, semester, session, request.user.studentId]
      );

      if (result.rowCount === 0) {
        return response.status(404).json({ message: 'Student profile not found' });
      }

      return response.status(200).json({ student: result.rows[0] });
    } catch (error) {
      console.error('Student profile update failed:', error.message);
      return response.status(500).json({ message: 'Unable to update student profile' });
    }
  });

  router.patch('/:id/reset-password', authenticateToken, requireRole(...ADMIN_ROLES), async (request, response) => {
    const { id } = request.params; // this is the student uid based on how frontend uses it
    const { newPassword } = request.body;

    if (!newPassword || newPassword.length < 6) {
      return response.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    try {
      const passwordHash = await bcrypt.hash(newPassword, 10);
      const result = await pool.query(
        `UPDATE students SET password_hash = $1 WHERE uid = $2 RETURNING id`,
        [passwordHash, id]
      );

      if (result.rowCount === 0) {
        return response.status(404).json({ message: 'Student not found' });
      }

      return response.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('Password reset failed:', error.message);
      return response.status(500).json({ message: 'Unable to reset password' });
    }
  });

  return router;
}

export { createStudentsRouter };

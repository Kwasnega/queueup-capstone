import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';

function createStudentsRouter(pool) {
  const router = Router();

  router.get('/me', authenticateToken, requireRole('student'), async (request, response) => {
    try {
      const result = await pool.query(
        `SELECT id, student_id, uid, full_name, email, faculty, department,
                programme, session, level, created_at
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

  return router;
}

export { createStudentsRouter };

import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';

function createNotificationsRouter(pool) {
  const router = Router();
  const studentOnly = [authenticateToken, requireRole('student')];

  router.get('/mine', ...studentOnly, async (request, response) => {
    try {
      const result = await pool.query(
        `SELECT id, user_uid, message, is_read, created_at
         FROM notifications
         WHERE user_uid = $1
         ORDER BY created_at DESC`,
        [request.user.uid]
      );
      return response.status(200).json({ notifications: result.rows });
    } catch (error) {
      console.error('Notifications lookup failed:', error.message);
      return response.status(500).json({ message: 'Unable to retrieve notifications' });
    }
  });

  router.patch('/mark-all-read', ...studentOnly, async (request, response) => {
    try {
      await pool.query(
        'UPDATE notifications SET is_read = TRUE WHERE user_uid = $1',
        [request.user.uid]
      );
      return response.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
      console.error('Mark notifications read failed:', error.message);
      return response.status(500).json({ message: 'Unable to mark notifications as read' });
    }
  });

  return router;
}

export { createNotificationsRouter };

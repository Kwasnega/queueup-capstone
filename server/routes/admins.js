import { Router } from 'express';
import { ADMIN_ROLES, authenticateToken, requireRole } from '../middleware/auth.js';

function createAdminsRouter(pool) {
  const router = Router();

  router.get('/me', authenticateToken, requireRole(...ADMIN_ROLES), async (request, response) => {
    try {
      const result = await pool.query(
        `SELECT id, uid, full_name, email, role, department, created_at
         FROM admins
         WHERE uid = $1`,
        [request.user.uid]
      );

      if (result.rowCount === 0) {
        return response.status(404).json({ message: 'Admin profile not found' });
      }

      return response.status(200).json({ admin: result.rows[0] });
    } catch (error) {
      console.error('Admin profile lookup failed:', error.message);
      return response.status(500).json({ message: 'Unable to retrieve admin profile' });
    }
  });

  return router;
}

export { createAdminsRouter };

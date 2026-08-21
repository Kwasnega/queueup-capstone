import { Router } from 'express';
import { ADMIN_ROLES, authenticateToken, requireRole } from '../middleware/auth.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

function createAdminsRouter(pool) {
  const router = Router();

  // Get admin profile (me)
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

  // GET all admins (SuperAdmin only)
  router.get('/', authenticateToken, requireRole('SuperAdmin'), async (request, response) => {
    try {
      const result = await pool.query(
        `SELECT id, uid, full_name, email, role, department, is_active, created_at
         FROM admins
         ORDER BY created_at DESC`
      );

      return response.status(200).json({ admins: result.rows });
    } catch (error) {
      console.error('Admins lookup failed:', error.message);
      return response.status(500).json({ message: 'Unable to retrieve admins' });
    }
  });

  // POST create admin (SuperAdmin only)
  router.post('/', authenticateToken, requireRole('SuperAdmin'), async (request, response) => {
    const { email, role, password } = request.body;

    if (!email || !role || !password) {
      return response.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const checkResult = await pool.query('SELECT id FROM admins WHERE email = $1', [email]);
      if (checkResult.rowCount > 0) {
        return response.status(409).json({ message: 'Admin with this email already exists' });
      }

      const uid = crypto.randomUUID();
      const passwordHash = await bcrypt.hash(password, 10);

      const result = await pool.query(
        `INSERT INTO admins (uid, email, role, password_hash)
         VALUES ($1, $2, $3, $4)
         RETURNING id, uid, email, role, is_active, created_at`,
        [uid, email, role, passwordHash]
      );

      return response.status(201).json({ admin: result.rows[0] });
    } catch (error) {
      console.error('Admin creation failed:', error.message);
      return response.status(500).json({ message: 'Unable to create admin' });
    }
  });

  // PATCH update admin (SuperAdmin only)
  router.patch('/:uid', authenticateToken, requireRole('SuperAdmin'), async (request, response) => {
    const { uid } = request.params;
    const { role, is_active } = request.body;

    try {
      const result = await pool.query(
        `UPDATE admins
         SET role = COALESCE($1, role),
             is_active = COALESCE($2, is_active)
         WHERE uid = $3
         RETURNING id, uid, email, role, is_active, created_at`,
        [role, is_active, uid]
      );

      if (result.rowCount === 0) {
        return response.status(404).json({ message: 'Admin not found' });
      }

      return response.status(200).json({ admin: result.rows[0] });
    } catch (error) {
      console.error('Admin update failed:', error.message);
      return response.status(500).json({ message: 'Unable to update admin' });
    }
  });

  // DELETE admin (SuperAdmin only)
  router.delete('/:uid', authenticateToken, requireRole('SuperAdmin'), async (request, response) => {
    const { uid } = request.params;

    if (uid === request.user.uid) {
      return response.status(403).json({ message: 'Cannot delete yourself' });
    }

    try {
      const checkResult = await pool.query('SELECT role FROM admins WHERE uid = $1', [uid]);
      if (checkResult.rowCount === 0) {
        return response.status(404).json({ message: 'Admin not found' });
      }

      if (checkResult.rows[0].role === 'SuperAdmin') {
        return response.status(403).json({ message: 'Cannot delete a SuperAdmin' });
      }

      await pool.query('DELETE FROM admins WHERE uid = $1', [uid]);
      return response.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
      console.error('Admin deletion failed:', error.message);
      return response.status(500).json({ message: 'Unable to delete admin' });
    }
  });

  return router;
}

export { createAdminsRouter };

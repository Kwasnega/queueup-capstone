import { Router } from 'express';
import { ADMIN_ROLES, authenticateToken, requireRole } from '../middleware/auth.js';

function createComplaintsRouter(pool) {
  const router = Router();
  const studentOnly = [authenticateToken, requireRole('student')];
  const adminOnly = [authenticateToken, requireRole(...ADMIN_ROLES)];

  router.post('/', ...studentOnly, async (request, response) => {
    const {
      subject,
      type,
      recipient,
      recipient_email: recipientEmail,
      admin_route: adminRoute,
      text
    } = request.body;

    if (!subject || !text) {
      return response.status(400).json({ message: 'subject and text are required' });
    }

    try {
      const result = await pool.query(
        `INSERT INTO complaints
          (student_id, subject, type, recipient, recipient_email, admin_route, text)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [request.user.studentId, subject, type, recipient, recipientEmail, adminRoute, text]
      );

      return response.status(201).json({
        message: 'Complaint submitted successfully',
        complaint: result.rows[0]
      });
    } catch (error) {
      console.error('Complaint creation failed:', error.message);
      return response.status(500).json({ message: 'Unable to submit complaint' });
    }
  });

  router.get('/mine', ...studentOnly, async (request, response) => {
    try {
      const result = await pool.query(
        'SELECT * FROM complaints WHERE student_id = $1 ORDER BY date_submitted DESC',
        [request.user.studentId]
      );

      return response.status(200).json({ complaints: result.rows });
    } catch (error) {
      console.error('Student complaints lookup failed:', error.message);
      return response.status(500).json({ message: 'Unable to retrieve complaints' });
    }
  });

  router.get('/', ...adminOnly, async (request, response) => {
    const filters = [];
    const values = [];

    if (request.query.status) {
      values.push(request.query.status);
      filters.push(`status = $${values.length}`);
    }

    if (request.query.admin_route) {
      values.push(request.query.admin_route);
      filters.push(`admin_route = $${values.length}`);
    }

    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    try {
      const result = await pool.query(
        `SELECT * FROM complaints ${whereClause} ORDER BY date_submitted DESC`,
        values
      );

      return response.status(200).json({ complaints: result.rows });
    } catch (error) {
      console.error('Complaints lookup failed:', error.message);
      return response.status(500).json({ message: 'Unable to retrieve complaints' });
    }
  });

  router.patch('/:id/status', ...adminOnly, async (request, response) => {
    const { status } = request.body;
    const itemId = Number(request.params.id);

    if (!Number.isInteger(itemId) || itemId < 1 || !status) {
      return response.status(400).json({ message: 'A valid id and status are required' });
    }

    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      const current = await client.query(
        'SELECT * FROM complaints WHERE id = $1 FOR UPDATE',
        [itemId]
      );

      if (current.rowCount === 0) {
        await client.query('ROLLBACK');
        return response.status(404).json({ message: 'Complaint not found' });
      }

      const result = await client.query(
        'UPDATE complaints SET status = $1 WHERE id = $2 RETURNING *',
        [status, itemId]
      );

      await client.query(
        `INSERT INTO status_history (item_id, item_type, old_status, new_status, changed_by)
         VALUES ($1, $2, $3, $4, $5)`,
        [itemId, 'complaint', current.rows[0].status, status, request.user.uid]
      );
      await client.query('COMMIT');

      return response.status(200).json({
        message: 'Complaint status updated successfully',
        complaint: result.rows[0]
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Complaint status update failed:', error.message);
      return response.status(500).json({ message: 'Unable to update complaint status' });
    } finally {
      client.release();
    }
  });

  return router;
}

export { createComplaintsRouter };

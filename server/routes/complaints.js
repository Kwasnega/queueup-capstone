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

  router.delete('/:id', ...studentOnly, async (request, response) => {
    const itemId = Number(request.params.id);

    if (!Number.isInteger(itemId) || itemId < 1) {
      return response.status(400).json({ message: 'A valid id is required' });
    }

    try {
      const result = await pool.query(
        'DELETE FROM complaints WHERE id = $1 AND student_id = $2 RETURNING id',
        [itemId, request.user.studentId]
      );

      if (result.rowCount === 0) {
        const existing = await pool.query('SELECT student_id FROM complaints WHERE id = $1', [itemId]);
        if (existing.rowCount > 0) {
          return response.status(403).json({ message: 'You can only delete your own complaints' });
        }
        return response.status(404).json({ message: 'Complaint not found' });
      }

      await pool.query('DELETE FROM status_history WHERE item_id = $1 AND item_type = $2', [itemId, 'complaint']);
      return response.status(200).json({ message: 'Complaint deleted successfully' });
    } catch (error) {
      console.error('Complaint deletion failed:', error.message);
      return response.status(500).json({ message: 'Unable to delete complaint' });
    }
  });

  router.get('/:id/history', authenticateToken, async (request, response) => {
    const itemId = Number(request.params.id);

    if (!Number.isInteger(itemId) || itemId < 1) {
      return response.status(400).json({ message: 'A valid id is required' });
    }

    try {
      const complaint = await pool.query('SELECT student_id FROM complaints WHERE id = $1', [itemId]);
      if (complaint.rowCount === 0) {
        return response.status(404).json({ message: 'Complaint not found' });
      }
      if (request.user.role === 'student' && complaint.rows[0].student_id !== request.user.studentId) {
        return response.status(403).json({ message: 'You do not have permission to view this history' });
      }

      const result = await pool.query(
        `SELECT * FROM status_history
         WHERE item_id = $1 AND item_type = $2
         ORDER BY changed_at ASC`,
        [itemId, 'complaint']
      );
      return response.status(200).json({ history: result.rows });
    } catch (error) {
      console.error('Complaint history lookup failed:', error.message);
      return response.status(500).json({ message: 'Unable to retrieve complaint history' });
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
        `SELECT complaints.*, students.uid AS student_uid
         FROM complaints
         JOIN students ON students.student_id = complaints.student_id
         WHERE complaints.id = $1
         FOR UPDATE OF complaints`,
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
      await client.query(
        `INSERT INTO notifications (user_uid, message)
         VALUES ($1, $2)`,
        [current.rows[0].student_uid, `Your complaint '${current.rows[0].subject}' status changed to ${status}`]
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

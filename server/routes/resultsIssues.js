import { Router } from 'express';
import { ADMIN_ROLES, authenticateToken, requireRole } from '../middleware/auth.js';

function createResultsIssuesRouter(pool) {
  const router = Router();
  const studentOnly = [authenticateToken, requireRole('student')];
  const adminOnly = [authenticateToken, requireRole(...ADMIN_ROLES)];

  router.post('/', ...studentOnly, async (request, response) => {
    const {
      faculty,
      department,
      programme,
      session,
      course_code: courseCode,
      course_title: courseTitle,
      lecturer_name: lecturerName,
      description,
      comment,
      attachment_url: attachmentUrl
    } = request.body;

    if (!courseCode || !description) {
      return response.status(400).json({ message: 'course_code and description are required' });
    }

    try {
      const result = await pool.query(
        `INSERT INTO results_issues
          (student_id, faculty, department, programme, session, course_code, course_title,
           lecturer_name, description, comment, attachment_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [
          request.user.studentId,
          faculty,
          department,
          programme,
          session,
          courseCode,
          courseTitle,
          lecturerName,
          description,
          comment,
          attachmentUrl
        ]
      );

      return response.status(201).json({
        message: 'Results issue submitted successfully',
        resultsIssue: result.rows[0]
      });
    } catch (error) {
      console.error('Results issue creation failed:', error.message);
      return response.status(500).json({ message: 'Unable to submit results issue' });
    }
  });

  router.get('/mine', ...studentOnly, async (request, response) => {
    try {
      const result = await pool.query(
        'SELECT * FROM results_issues WHERE student_id = $1 ORDER BY date_submitted DESC',
        [request.user.studentId]
      );

      return response.status(200).json({ resultsIssues: result.rows });
    } catch (error) {
      console.error('Student results issues lookup failed:', error.message);
      return response.status(500).json({ message: 'Unable to retrieve results issues' });
    }
  });

  router.delete('/:id', ...studentOnly, async (request, response) => {
    const itemId = Number(request.params.id);

    if (!Number.isInteger(itemId) || itemId < 1) {
      return response.status(400).json({ message: 'A valid id is required' });
    }

    try {
      const result = await pool.query(
        'DELETE FROM results_issues WHERE id = $1 AND student_id = $2 RETURNING id',
        [itemId, request.user.studentId]
      );

      if (result.rowCount === 0) {
        const existing = await pool.query('SELECT student_id FROM results_issues WHERE id = $1', [itemId]);
        if (existing.rowCount > 0) {
          return response.status(403).json({ message: 'You can only delete your own results issues' });
        }
        return response.status(404).json({ message: 'Results issue not found' });
      }

      await pool.query('DELETE FROM status_history WHERE item_id = $1 AND item_type = $2', [itemId, 'results_issue']);
      return response.status(200).json({ message: 'Results issue deleted successfully' });
    } catch (error) {
      console.error('Results issue deletion failed:', error.message);
      return response.status(500).json({ message: 'Unable to delete results issue' });
    }
  });

  router.get('/:id/history', authenticateToken, async (request, response) => {
    const itemId = Number(request.params.id);

    if (!Number.isInteger(itemId) || itemId < 1) {
      return response.status(400).json({ message: 'A valid id is required' });
    }

    try {
      const issue = await pool.query('SELECT student_id FROM results_issues WHERE id = $1', [itemId]);
      if (issue.rowCount === 0) {
        return response.status(404).json({ message: 'Results issue not found' });
      }
      if (request.user.role === 'student' && issue.rows[0].student_id !== request.user.studentId) {
        return response.status(403).json({ message: 'You do not have permission to view this history' });
      }

      const result = await pool.query(
        `SELECT * FROM status_history
         WHERE item_id = $1 AND item_type = $2
         ORDER BY changed_at ASC`,
        [itemId, 'results_issue']
      );
      return response.status(200).json({ history: result.rows });
    } catch (error) {
      console.error('Results issue history lookup failed:', error.message);
      return response.status(500).json({ message: 'Unable to retrieve results issue history' });
    }
  });

  router.get('/', ...adminOnly, async (request, response) => {
    const values = [];
    let whereClause = '';

    if (request.query.status) {
      values.push(request.query.status);
      whereClause = `WHERE status = $${values.length}`;
    }

    try {
      const result = await pool.query(
        `SELECT * FROM results_issues ${whereClause} ORDER BY date_submitted DESC`,
        values
      );

      return response.status(200).json({ resultsIssues: result.rows });
    } catch (error) {
      console.error('Results issues lookup failed:', error.message);
      return response.status(500).json({ message: 'Unable to retrieve results issues' });
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
        `SELECT results_issues.*, students.uid AS student_uid
         FROM results_issues
         JOIN students ON students.student_id = results_issues.student_id
         WHERE results_issues.id = $1
         FOR UPDATE OF results_issues`,
        [itemId]
      );

      if (current.rowCount === 0) {
        await client.query('ROLLBACK');
        return response.status(404).json({ message: 'Results issue not found' });
      }

      const result = await client.query(
        'UPDATE results_issues SET status = $1 WHERE id = $2 RETURNING *',
        [status, itemId]
      );

      await client.query(
        `INSERT INTO status_history (item_id, item_type, old_status, new_status, changed_by)
         VALUES ($1, $2, $3, $4, $5)`,
        [itemId, 'results_issue', current.rows[0].status, status, request.user.uid]
      );
      await client.query(
        `INSERT INTO notifications (user_uid, message)
         VALUES ($1, $2)`,
        [current.rows[0].student_uid, `Your results issue for ${current.rows[0].course_code} status changed to ${status}`]
      );
      await client.query('COMMIT');

      return response.status(200).json({
        message: 'Results issue status updated successfully',
        resultsIssue: result.rows[0]
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Results issue status update failed:', error.message);
      return response.status(500).json({ message: 'Unable to update results issue status' });
    } finally {
      client.release();
    }
  });

  return router;
}

export { createResultsIssuesRouter };

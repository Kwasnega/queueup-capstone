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
        'SELECT * FROM results_issues WHERE id = $1 FOR UPDATE',
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

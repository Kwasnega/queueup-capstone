import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Stack
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import StatusBadge from './StatusBadge';

interface ResultIssue {
  id: string;
  course_code: string;
  course_title?: string;
  courseTitle?: string;
  course_name?: string;
  student_id: string;
  description: string;
  status: string;
  date_submitted: number;
  lecturer_name?: string;
  lecturerName?: string;
  faculty?: string;
  admin_logs?: string[];
}

interface ResultIssueTableProps {
  resultIssues: ResultIssue[];
  onViewDetails: (issue: ResultIssue) => void;
  onUpdateStatus: (issueId: string, newStatus: string) => void;
}

const ResultIssueTable: React.FC<ResultIssueTableProps> = ({
  resultIssues,
  onViewDetails,
  onUpdateStatus
}) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getCourseTitle = (issue: ResultIssue) => {
    return issue.course_title || issue.courseTitle || issue.course_name || 'N/A';
  };

  if (resultIssues.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No result issues found.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Course</TableCell>
            <TableCell>Student</TableCell>
            <TableCell>Issue</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {resultIssues.map((issue) => (
            <TableRow key={issue.id} hover>
              <TableCell>
                <Stack>
                  <Typography variant="body2" fontWeight="medium">
                    {issue.course_code || 'N/A'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {getCourseTitle(issue)}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {issue.student_id}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ maxWidth: 200 }}>
                  {issue.description || 'No description provided'}
                </Typography>
              </TableCell>
              <TableCell>
                <StatusBadge status={issue.status} />
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {formatDate(issue.date_submitted)}
                </Typography>
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={() => onViewDetails(issue)}
                  >
                    View
                  </Button>
                  {issue.status !== 'resolved' && (
                    <>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => onUpdateStatus(issue.id, 'in_progress')}
                        disabled={issue.status === 'in_progress'}
                      >
                        In Progress
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => onUpdateStatus(issue.id, 'resolved')}
                      >
                        Resolve
                      </Button>
                    </>
                  )}
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => onUpdateStatus(issue.id, 'inactive')}
                  >
                    Delete
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ResultIssueTable;
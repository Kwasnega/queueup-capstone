import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Box,
  Paper,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import StatusBadge from './StatusBadge';

const DetailItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  marginBottom: theme.spacing(2),
}));

const Label = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));

const Value = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 400,
  color: theme.palette.text.primary,
}));

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
  comment?: string;
}

interface Student {
  uid: string;
  studentId: string;
  full_name?: string;
  name?: string;
  email?: string;
  programme?: string;
  faculty?: string;
  level?: string;
  semester?: string;
}

interface ResultIssueModalProps {
  issue: ResultIssue | null;
  student: Student | null;
  open: boolean;
  onClose: () => void;
}

const ResultIssueModal: React.FC<ResultIssueModalProps> = ({
  issue,
  student,
  open,
  onClose
}) => {
  if (!issue) return null;

  const getCourseTitle = () => {
    return issue.course_title || issue.courseTitle || issue.course_name || 'N/A';
  };

  const getLecturerName = () => {
    return issue.lecturer_name || issue.lecturerName || 'N/A';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Result Issue Details</Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Issue Information */}
          <Box>
            <Typography variant="h6" gutterBottom color="primary">
              Issue Information
            </Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <Box flex={1}>
                <DetailItem>
                  <Label>Course Code</Label>
                  <Value>{issue.course_code || 'N/A'}</Value>
                </DetailItem>
                <DetailItem>
                  <Label>Course Title</Label>
                  <Value>{getCourseTitle()}</Value>
                </DetailItem>
                <DetailItem>
                  <Label>Lecturer Name</Label>
                  <Value>{getLecturerName()}</Value>
                </DetailItem>
              </Box>
              <Box flex={1}>
                <DetailItem>
                  <Label>Status</Label>
                  <Box>
                    <StatusBadge status={issue.status} size="medium" />
                  </Box>
                </DetailItem>
                <DetailItem>
                  <Label>Date Submitted</Label>
                  <Value>{formatDate(issue.date_submitted)}</Value>
                </DetailItem>
                {issue.faculty && (
                  <DetailItem>
                    <Label>Faculty</Label>
                    <Value>{issue.faculty}</Value>
                  </DetailItem>
                )}
              </Box>
            </Stack>
            
            <DetailItem>
              <Label>Issue Description</Label>
              <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                <Typography variant="body2">
                  {issue.description || 'No description provided'}
                </Typography>
              </Paper>
            </DetailItem>

            {issue.comment && (
              <DetailItem>
                <Label>Additional Comment</Label>
                <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                  <Typography variant="body2">{issue.comment}</Typography>
                </Paper>
              </DetailItem>
            )}
          </Box>

          <Divider />

          {/* Student Information */}
          <Box>
            <Typography variant="h6" gutterBottom color="primary">
              Student Information
            </Typography>
            {student ? (
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                <Box flex={1}>
                  <DetailItem>
                    <Label>Full Name</Label>
                    <Value>{student.full_name || student.name || 'N/A'}</Value>
                  </DetailItem>
                  <DetailItem>
                    <Label>Student ID</Label>
                    <Value>{student.studentId || 'N/A'}</Value>
                  </DetailItem>
                  <DetailItem>
                    <Label>Email</Label>
                    <Value>{student.email || 'N/A'}</Value>
                  </DetailItem>
                </Box>
                <Box flex={1}>
                  <DetailItem>
                    <Label>Programme</Label>
                    <Value>{student.programme || 'N/A'}</Value>
                  </DetailItem>
                  <DetailItem>
                    <Label>Faculty</Label>
                    <Value>{student.faculty || 'N/A'}</Value>
                  </DetailItem>
                  <DetailItem>
                    <Label>Level</Label>
                    <Value>{student.level || 'N/A'}</Value>
                  </DetailItem>
                </Box>
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Student profile not found for ID: {issue.student_id}
              </Typography>
            )}
          </Box>

          <Divider />

          {/* Admin Logs */}
          <Box>
            <Typography variant="h6" gutterBottom color="primary">
              Admin Activity Logs
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, maxHeight: 200, overflow: 'auto' }}>
              {issue.admin_logs && issue.admin_logs.length > 0 ? (
                <Stack spacing={1}>
                  {issue.admin_logs.map((log, index) => (
                    <Typography key={index} variant="body2" sx={{ 
                      borderBottom: index < issue.admin_logs!.length - 1 ? '1px solid #e0e0e0' : 'none',
                      pb: index < issue.admin_logs!.length - 1 ? 1 : 0
                    }}>
                      {log}
                    </Typography>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No admin activity recorded yet.
                </Typography>
              )}
            </Paper>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResultIssueModal;
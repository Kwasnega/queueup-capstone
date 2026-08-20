import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Stack
} from '@mui/material';
import ResultIssueTable from './ResultIssueTable';

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

interface ResultIssuesTabProps {
  resultIssues: ResultIssue[];
  onViewDetails: (issue: ResultIssue) => void;
  onUpdateStatus: (issueId: string, newStatus: string) => void;
}

const ResultIssuesTab: React.FC<ResultIssuesTabProps> = ({
  resultIssues,
  onViewDetails,
  onUpdateStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Enhanced filtering logic to exclude invalid entries
  const filteredResultIssues = resultIssues.filter(issue => {
    // First, validate that this is a proper result issue entry
    const isValidEntry = (
      issue.id && 
      issue.student_id && 
      issue.student_id !== 'Unknown' && 
      issue.student_id !== 'N/A' &&
      issue.date_submitted &&
      (issue.course_code || issue.description) // Must have either course code or description
    );

    if (!isValidEntry) {
      console.log('Filtering out invalid result issue:', issue);
      return false;
    }

    // Apply search filter
    const matchesSearch = !searchTerm || (
      (issue.course_code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (issue.student_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (issue.course_title || issue.courseTitle || issue.course_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (issue.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply status filter
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6" gutterBottom>
              All Result Issues ({filteredResultIssues.length})
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
              <TextField
                placeholder="Search course or student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{ minWidth: 300 }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="Queued">Queued</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>

          <ResultIssueTable
            resultIssues={filteredResultIssues}
            onViewDetails={onViewDetails}
            onUpdateStatus={onUpdateStatus}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ResultIssuesTab;
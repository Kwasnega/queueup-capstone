import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
  Tooltip,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Download as DownloadIcon
} from '@mui/icons-material';

interface User {
  uid: string;
  studentId: string;
  full_name?: string;
  name?: string;
  email?: string;
  faculty?: string;
  department?: string;
  programme?: string;
  level?: string;
  semester?: string;
  session?: string;
  timestamp?: number;
  emailVerified?: boolean;
  email_verified?: boolean;
}

interface Complaint {
  id: string;
  subject: string;
  type: string;
  status: string;
  student_id: string;
  description?: string;
  text?: string;
  date_submitted: string | number;
  admin_logs?: string[];
  recipient?: string;
  admin_route?: string;
}

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

interface ExcelExportButtonProps {
  users: User[];
  complaints: Complaint[];
  resultIssues: ResultIssue[];
  adminRole: string;
  disabled?: boolean;
}

const ExcelExportButton: React.FC<ExcelExportButtonProps> = ({
  users,
  complaints,
  resultIssues,
  adminRole,
  disabled = false
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const formatDate = (timestamp: string | number) => {
    if (!timestamp) return 'N/A';
    try {
      const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp);
      return date.toLocaleString();
    } catch {
      return 'Invalid Date';
    }
  };

  const getCourseTitle = (issue: ResultIssue) => {
    return issue.course_title || issue.courseTitle || issue.course_name || 'N/A';
  };

  const getLecturerName = (issue: ResultIssue) => {
    return issue.lecturer_name || issue.lecturerName || 'N/A';
  };

  const exportToExcel = async () => {
    if (adminRole !== 'SuperAdmin') {
      showSnackbar('Only SuperAdmin can export all data', 'error');
      return;
    }

    setIsExporting(true);
    try {
      // Import xlsx library dynamically
      const XLSX = await import('xlsx');
      
      // Prepare Users data
      const usersData = users.map(user => ({
        'Student ID': user.studentId || 'N/A',
        'Full Name': user.full_name || user.name || 'N/A',
        'Email': user.email || 'N/A',
        'Faculty': user.faculty || 'N/A',
        'Department': user.department || 'N/A',
        'Programme': user.programme || 'N/A',
        'Level': user.level || 'N/A',
        'Semester': user.semester || 'N/A',
        'Session': user.session || 'N/A',
        'Email Verified': user.emailVerified || user.email_verified ? 'Yes' : 'No',
        'Registration Date': user.timestamp ? formatDate(user.timestamp) : 'N/A'
      }));

      // Prepare Complaints data
      const complaintsData = complaints.map(complaint => ({
        'Complaint ID': complaint.id || 'N/A',
        'Student ID': complaint.student_id || 'N/A',
        'Subject': complaint.subject || 'N/A',
        'Type': complaint.type || 'N/A',
        'Status': complaint.status || 'N/A',
        'Recipient': complaint.recipient || 'N/A',
        'Admin Route': complaint.admin_route || 'N/A',
        'Description': complaint.description || complaint.text || 'N/A',
        'Date Submitted': formatDate(complaint.date_submitted),
        'Admin Logs': complaint.admin_logs ? complaint.admin_logs.join(' | ') : 'No logs'
      }));

      // Prepare Result Issues data
      const resultIssuesData = resultIssues.map(issue => ({
        'Issue ID': issue.id || 'N/A',
        'Student ID': issue.student_id || 'N/A',
        'Course Code': issue.course_code || 'N/A',
        'Course Title': getCourseTitle(issue),
        'Lecturer Name': getLecturerName(issue),
        'Faculty': issue.faculty || 'N/A',
        'Status': issue.status || 'N/A',
        'Description': issue.description || 'N/A',
        'Date Submitted': formatDate(issue.date_submitted),
        'Admin Logs': issue.admin_logs ? issue.admin_logs.join(' | ') : 'No logs'
      }));

      // Create workbook
      const workbook = XLSX.utils.book_new();

      // Add worksheets
      const usersWorksheet = XLSX.utils.json_to_sheet(usersData);
      const complaintsWorksheet = XLSX.utils.json_to_sheet(complaintsData);
      const resultIssuesWorksheet = XLSX.utils.json_to_sheet(resultIssuesData);

      // Set column widths for better readability
      const setColumnWidths = (worksheet: any) => {
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
        const cols = [];
        for (let C = range.s.c; C <= range.e.c; ++C) {
          cols.push({ wch: 20 }); // Set width to 20 characters
        }
        worksheet['!cols'] = cols;
      };

      setColumnWidths(usersWorksheet);
      setColumnWidths(complaintsWorksheet);
      setColumnWidths(resultIssuesWorksheet);

      // Add sheets to workbook
      XLSX.utils.book_append_sheet(workbook, usersWorksheet, 'Users');
      XLSX.utils.book_append_sheet(workbook, complaintsWorksheet, 'Complaints');
      XLSX.utils.book_append_sheet(workbook, resultIssuesWorksheet, 'Result Issues');

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `QUEUEUP_Data_Export_${timestamp}.xlsx`;

      // Write and download file
      XLSX.writeFile(workbook, filename);

      showSnackbar(`Data exported successfully as ${filename}`, 'success');
    } catch (error) {
      console.error('Export error:', error);
      showSnackbar('Failed to export data. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Only show button for SuperAdmin
  if (adminRole !== 'SuperAdmin') {
    return null;
  }

  return (
    <>
      <Tooltip title="Export all system data to Excel file">
        <Button
          variant="contained"
          color="success"
          startIcon={isExporting ? <CircularProgress size={16} color="inherit" /> : <DownloadIcon />}
          onClick={exportToExcel}
          disabled={disabled || isExporting}
          sx={{ ml: 2 }}
        >
          {isExporting ? 'Exporting...' : 'Export to Excel'}
        </Button>
      </Tooltip>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ExcelExportButton;
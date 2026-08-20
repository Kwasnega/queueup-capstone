import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Stack,
  Alert
} from '@mui/material';
import {
  Logout as LogoutIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getDatabase, ref, onValue, update, push } from 'firebase/database';
import { useFirebaseListenerManager } from './FirebaseListenerManager';
import ActivityFeed from './ActivityFeed';
import ResultIssuesTab from './ResultIssuesTab';
import ResultIssueModal from './ResultIssueModal';
import StatusBadge from './StatusBadge';
import ExcelExportButton from './ExcelExportButton';

const db = getDatabase();

// Mock data for preview - updated to match actual database structure with email verification
const mockUsers = [
  {
    uid: 'tSTJEW7A2TY8XMqYFlatQ5AWiyB3',
    name: 'Lord Nyameyie Mensah',
    full_name: 'Lord Nyameyie Mensah',
    studentId: '2425400843',
    studentID: '2425400843',
    email: '2425400843@live.gctu.edu.gh',
    role: 'Student',
    faculty: 'Faculty of Computing & Information Systems (FoCIS)',
    department: 'Faculty of Computing & Information Systems (FoCIS)',
    programme: 'BSc Computer Science (Cybersecurity option)',
    group: 'Group D',
    level: 'Level 100',
    academic_year: 'Level 100',
    semester: 'Second Semester',
    session: 'Evening',
    timestamp: Date.now() - 86400000,
    emailVerified: true, // Email verified user
    email_verified: true
  },
  {
    uid: '2',
    name: 'Jane Smith',
    full_name: 'Jane Smith',
    studentId: '2425400844',
    studentID: '2425400844',
    email: '2425400844@live.gctu.edu.gh',
    role: 'Student',
    faculty: 'Faculty of Computing and Information Systems',
    department: 'Information Technology',
    programme: 'BSc Information Technology',
    group: 'IT-B',
    level: '300',
    academic_year: '300',
    semester: 'Second Semester',
    session: '2024/2025',
    timestamp: Date.now() - 172800000,
    emailVerified: true, // Email verified user
    email_verified: true
  },
  {
    uid: '3',
    name: 'Unverified User',
    full_name: 'Unverified User',
    studentId: '2425400845',
    studentID: '2425400845',
    email: '2425400845@live.gctu.edu.gh',
    role: 'Student',
    faculty: 'Faculty of Computing and Information Systems',
    department: 'Information Technology',
    programme: 'BSc Information Technology',
    group: 'IT-C',
    level: '200',
    academic_year: '200',
    semester: 'First Semester',
    session: '2024/2025',
    timestamp: Date.now() - 259200000,
    emailVerified: false, // Email NOT verified - should be filtered out
    email_verified: false
  }
];

const mockComplaints = [
  {
    id: 'comp1',
    subject: 'Academic Issue',
    type: 'Academic',
    status: 'Queued',
    student_id: '2425400843',
    description: 'Having issues with course registration system',
    date_submitted: Date.now() - 86400000,
    admin_logs: ['Admin started review process'],
    recipient: 'HOD',
    recipient_email: 'hod@gctu.edu.gh',
    admin_route: 'hod'
  },
  {
    id: 'comp2',
    subject: 'Technical Problem',
    type: 'Technical',
    status: 'in_progress',
    student_id: '2425400844',
    description: 'Portal login not working properly',
    date_submitted: Date.now() - 172800000,
    admin_logs: ['Admin assigned to technical team', 'Under investigation'],
    recipient: 'Registrar',
    recipient_email: 'registrar@gctu.edu.gh',
    admin_route: 'registrar'
  },
  {
    id: 'comp3',
    subject: 'Examination Issue',
    type: 'Academic',
    status: 'Queued',
    student_id: '2425400843',
    description: 'Missing exam schedule information',
    date_submitted: Date.now() - 259200000,
    admin_logs: ['Complaint received'],
    recipient: 'Exam',
    recipient_email: 'exam@gctu.edu.gh',
    admin_route: 'exam'
  },
  {
    id: 'comp4',
    subject: 'General Inquiry',
    type: 'Administrative',
    status: 'Queued',
    student_id: '2425400844',
    description: 'General administrative question',
    date_submitted: Date.now() - 345600000,
    admin_logs: ['Complaint received'],
    recipient: 'General',
    recipient_email: null,
    admin_route: 'general'
  }
];

const mockResultIssues = [
  {
    id: 'result1',
    course_code: 'CS201',
    course_title: 'Data Structures and Algorithms',
    student_id: '2425400843',
    description: 'Missing grade for final exam',
    status: 'Queued',
    date_submitted: Date.now() - 86400000,
    lecturer_name: 'Dr. John Smith'
  }
];

const mockInactiveItems = [
  {
    id: 'inactive1',
    type: 'complaint',
    subject: 'Library Access Issue',
    student_id: '2425400843',
    description: 'Cannot access digital library resources',
    status: 'inactive',
    date_submitted: Date.now() - 172800000,
    date_deleted: Date.now() - 86400000,
    days_until_permanent_deletion: 29
  },
  {
    id: 'inactive2',
    type: 'result_issue',
    course_code: 'IT301',
    student_id: '2425400844',
    description: 'Incorrect GPA calculation',
    status: 'inactive',
    date_submitted: Date.now() - 259200000,
    date_deleted: Date.now() - 172800000,
    days_until_permanent_deletion: 28
  }
];

const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff',
    },
    secondary: {
      main: '#6c757d',
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [selectedResultIssue, setSelectedResultIssue] = useState<any>(null);
  const [userSearch, setUserSearch] = useState('');
  const [complaintSearch, setComplaintSearch] = useState('');
  const [complaintFilter, setComplaintFilter] = useState('all');
  const [resultSearch, setResultSearch] = useState('');
  const [resultFilter, setResultFilter] = useState('all');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState('SuperAdmin');
  const [createAdminOpen, setCreateAdminOpen] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    email: '',
    role: 'Admin',
    password: ''
  });

  // Real data from Firebase
  const [realUsers, setRealUsers] = useState<any[]>([]);
  const [realComplaints, setRealComplaints] = useState<any[]>([]);
  const [realResultIssues, setRealResultIssues] = useState<any[]>([]);
  const [, setLoading] = useState(true);

  // Use Firebase listener manager
  const listenerManager = useFirebaseListenerManager();

  // Helper function to log admin actions with comprehensive updates
  const logAdminAction = async (itemType: 'complaint' | 'result_issue', itemId: string, action: string, newStatus?: string) => {
    try {
      const timestamp = new Date().toISOString();
      const adminName = adminRole || 'Admin';
      const logMessage = newStatus 
        ? `${adminName} changed status to ${newStatus} at ${timestamp}`
        : `${adminName} ${action} at ${timestamp}`;

      // Update the item's admin_logs - FIXED to use correct database path
      const itemPath = itemType === 'complaint' ? 'complaints' : 'result_issues'; // Changed from 'results_issues' to 'result_issues'
      const itemRef = ref(db, `${itemPath}/${itemId}`);
      
      // Get current item data
      const currentItem = itemType === 'complaint' 
        ? currentComplaints.find(c => c.id === itemId || c.unique_id === itemId)
        : currentResultIssues.find(r => r.id === itemId || r.unique_id === itemId);
      
      if (!currentItem) {
        console.error(`Item not found: ${itemType} with ID ${itemId}`);
        return;
      }
      
      const currentLogs = currentItem?.admin_logs || [];
      const updatedLogs = [...currentLogs, logMessage];
      
      const updates: any = {
        admin_logs: updatedLogs,
        last_updated: timestamp,
        last_updated_by: adminName,
        updated_at: timestamp
      };
      
      if (newStatus) {
        updates.status = newStatus;
      }
      
      // Update main record
      await update(itemRef, updates);
      
      // CRITICAL FIX: Update student-specific copy with proper synchronization
      if (currentItem?.student_id) {
        // For result issues, also update the nested student structure that the student dashboard reads from
        const studentItemPath = itemType === 'complaint' ? 'complaints' : 'result_issues'; // Use 'result_issues' for student path
        const studentItemRef = ref(db, `${studentItemPath}/${currentItem.student_id}/${itemId}`);
        
        try {
          // First try with the main ID
          await update(studentItemRef, updates);
          console.log(`Updated student copy at: ${studentItemPath}/${currentItem.student_id}/${itemId}`);
        } catch (error) {
          console.debug('Trying alternative student reference path');
          // Try with unique_id if available
          if (currentItem.unique_id && currentItem.unique_id !== itemId) {
            const studentItemRef2 = ref(db, `${studentItemPath}/${currentItem.student_id}/${currentItem.unique_id}`);
            await update(studentItemRef2, updates);
            console.log(`Updated student copy at: ${studentItemPath}/${currentItem.student_id}/${currentItem.unique_id}`);
          }
        }
      }
      
      // Create activity log entry for real-time feed
      const activityData = {
        type: itemType === 'complaint' ? 'complaint_update' : 'result_issue_update',
        item_id: itemId,
        item_type: itemType,
        admin_name: adminName,
        admin_role: adminRole,
        action: action,
        new_status: newStatus,
        student_id: currentItem.student_id,
        timestamp: timestamp,
        description: itemType === 'complaint' 
          ? `${currentItem.subject || 'Complaint'} - ${action}`
          : `${currentItem.course_code || 'Course'} (${currentItem.course_title || currentItem.courseTitle || currentItem.course_name || 'Course Title'}) - ${action}`,
        metadata: {
          item_data: currentItem,
          log_message: logMessage
        }
      };
      
      // Add to activity feed
      await push(ref(db, 'admin_activities'), activityData);
      
      console.log(`Admin action logged: ${logMessage}`);
      
      // Show success message
      alert(`${itemType === 'complaint' ? 'Complaint' : 'Result issue'} ${newStatus ? `status updated to ${newStatus}` : 'updated'} successfully!`);
      
    } catch (error) {
      console.error('Error logging admin action:', error);
      alert('Error updating item. Please try again.');
    }
  };

  const currentTheme = createTheme({
    ...theme,
    palette: {
      ...theme.palette,
      mode: darkMode ? 'dark' : 'light',
    },
  });

  // Function to filter complaints based on admin role
  const getFilteredComplaintsByRole = (complaints: any[], role: string) => {
    if (role === 'SuperAdmin') {
      return complaints; // SuperAdmin sees all complaints
    }
    
    // Map admin roles to their corresponding admin_route values
    const roleRouteMap: { [key: string]: string } = {
      'HOD': 'hod',
      'Dean': 'dean', 
      'Exam': 'exam',
      'Registrar': 'registrar'
    };
    
    const adminRoute = roleRouteMap[role];
    if (!adminRoute) {
      return complaints.filter(c => c.admin_route === 'general'); // Default to general complaints
    }
    
    // Return complaints assigned to this admin role + general complaints
    return complaints.filter(c => c.admin_route === adminRoute || c.admin_route === 'general');
  };

  // Setup Firebase listeners for real data
  useEffect(() => {
    const setupFirebaseListeners = () => {
      // Listen to users - Filter for email-verified users only
      const usersRef = ref(db, 'users');
      const usersUnsubscribe = onValue(usersRef, (snapshot) => {
        if (snapshot.exists()) {
          const users = snapshot.val();
          const allUsersArray = Object.entries(users).map(([id, user]: [string, any]) => ({
            uid: user.uid || id,
            studentId: user.studentId || user.studentID || id,
            ...user
          }));
          
          // Filter to show only email-verified users
          const verifiedUsersArray = allUsersArray.filter(user => {
            // Check if user has verified their email
            return user.emailVerified === true || user.email_verified === true;
          });
          
          console.log('[ADMIN DEBUG] User management - Total users:', allUsersArray.length, 'Verified users:', verifiedUsersArray.length);
          setRealUsers(verifiedUsersArray);
        } else {
          setRealUsers([]);
        }
      }, (error) => {
        console.error('Users listener error:', error);
        // Filter mock users for email verification as well
        const verifiedMockUsers = mockUsers.filter(user => 
          user.emailVerified === true || user.email_verified === true
        );
        setRealUsers(verifiedMockUsers.length > 0 ? verifiedMockUsers : mockUsers); // Fallback to mock data
      });
      listenerManager.addListener('admin-users', usersUnsubscribe);

      // Listen to complaints
      const complaintsRef = ref(db, 'complaints');
      const complaintsUnsubscribe = onValue(complaintsRef, (snapshot) => {
        if (snapshot.exists()) {
          const complaints = snapshot.val();
          const complaintsArray = Object.entries(complaints).map(([id, complaint]: [string, any]) => ({
            id,
            ...complaint
          })).filter(complaint => complaint.date_submitted); // Filter out nested student-specific data
          setRealComplaints(complaintsArray);
        } else {
          setRealComplaints([]);
        }
      }, (error) => {
        console.error('Complaints listener error:', error);
        setRealComplaints(mockComplaints); // Fallback to mock data
      });
      listenerManager.addListener('admin-complaints', complaintsUnsubscribe);

      // Listen to result issues - ENHANCED filtering to prevent "Unknown" entries
      const resultIssuesRef = ref(db, 'result_issues');
      const resultIssuesUnsubscribe = onValue(resultIssuesRef, (snapshot) => {
        if (snapshot.exists()) {
          const resultIssues = snapshot.val();
          const resultIssuesArray = Object.entries(resultIssues).map(([id, issue]: [string, any]) => {
            // Debug log each issue
            console.log(`Processing result issue ${id}:`, issue);
            
            // ENHANCED: More robust data validation and normalization
            const processedIssue = {
              id,
              ...issue,
              // Normalize course title field - check multiple possible field names
              course_title: issue.course_title || issue.courseTitle || issue.course_name || issue.title || null,
              // Ensure other critical fields are present
              course_code: issue.course_code || issue.courseCode || null,
              student_id: issue.student_id || issue.studentId || null,
              status: issue.status || 'Queued',
              description: issue.description || null,
              lecturer_name: issue.lecturer_name || issue.lecturerName || null,
              faculty: issue.faculty || null,
              date_submitted: issue.date_submitted || null
            };
            
            return processedIssue;
          }).filter(issue => {
            // ENHANCED: Stricter validation to exclude invalid entries
            const hasValidId = issue.id && typeof issue.id === 'string';
            const hasValidStudentId = issue.student_id && 
                                    issue.student_id !== 'Unknown' && 
                                    issue.student_id !== 'N/A' && 
                                    issue.student_id !== '' &&
                                    typeof issue.student_id === 'string';
            const hasDateSubmitted = issue.date_submitted && 
                                   typeof issue.date_submitted === 'number' && 
                                   issue.date_submitted > 0;
            const hasValidContent = (issue.course_code && issue.course_code !== 'N/A') || 
                                  (issue.description && issue.description !== 'No description provided');
            const isNotNestedData = typeof issue === 'object' && !Array.isArray(issue);
            
            const isValid = hasValidId && hasValidStudentId && hasDateSubmitted && hasValidContent && isNotNestedData;
            
            if (!isValid) {
              console.log(`Filtering out invalid result issue ${issue.id}:`, {
                hasValidId,
                hasValidStudentId,
                hasDateSubmitted,
                hasValidContent,
                student_id: issue.student_id,
                course_code: issue.course_code,
                description: issue.description
              });
            }
            
            return isValid;
          });
          
          setRealResultIssues(resultIssuesArray);
          console.log('Valid result issues loaded:', resultIssuesArray.length, resultIssuesArray);
        } else {
          setRealResultIssues([]);
        }
        setLoading(false);
      }, (error) => {
        console.error('Result issues listener error:', error);
        setRealResultIssues(mockResultIssues); // Fallback to mock data
        setLoading(false);
      });
      listenerManager.addListener('admin-results', resultIssuesUnsubscribe);
    };

    setupFirebaseListeners();

    // Simulate admin role detection
    const mockAdminRoles = ['SuperAdmin', 'HOD', 'Dean', 'Exam', 'Registrar'];
    const randomRole = mockAdminRoles[Math.floor(Math.random() * mockAdminRoles.length)];
    setAdminRole(randomRole);
    setIsSuperAdmin(randomRole === 'SuperAdmin');

    return () => {
      listenerManager.removeAllListeners();
    };
  }, [listenerManager]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'queued':
        return 'warning';
      case 'in_progress':
        return 'info';
      case 'resolved':
        return 'success';
      case 'deleted':
        return 'error';
      case 'inactive':
        return 'default';
      default:
        return 'default';
    }
  };

  // Function to map user fields like in the HTML version
  const mapUserFields = (user: any) => ({
    fullName: user.full_name || user.name || 'N/A',
    email: user.email || 'N/A',
    studentId: user.studentId || user.studentID || user.student_id || 'N/A',
    faculty: user.faculty || user.department || 'N/A',
    group: user.group || user.student_group || 'N/A',
    programme: user.programme || user.program || user.course || 'N/A',
    level: user.level || user.academic_year || 'N/A',
    semester: user.semester || user.current_semester || 'N/A',
    session: user.session || user.time_session || 'N/A'
  });

  // Use real data instead of mock data - ensure mock users are also filtered for verification
  const verifiedMockUsers = mockUsers.filter(user => 
    user.emailVerified === true || user.email_verified === true
  );
  const currentUsers = realUsers.length > 0 ? realUsers : (verifiedMockUsers.length > 0 ? verifiedMockUsers : mockUsers);
  const currentComplaints = realComplaints.length > 0 ? realComplaints : mockComplaints;
  const currentResultIssues = realResultIssues.length > 0 ? realResultIssues : mockResultIssues;

  const filteredUsers = currentUsers.filter(user =>
    (user.name || user.full_name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (user.studentId || user.studentID || '').includes(userSearch)
  );

  const filteredComplaints = getFilteredComplaintsByRole(currentComplaints, adminRole).filter(complaint => {
    const matchesSearch = (complaint.subject || '').toLowerCase().includes(complaintSearch.toLowerCase()) ||
      (complaint.student_id || '').includes(complaintSearch);
    const matchesFilter = complaintFilter === 'all' || complaint.status === complaintFilter;
    return matchesSearch && matchesFilter;
  });

  // Enhanced filtering for result issues display
  const filteredResultIssues = currentResultIssues.filter(issue => {
    // Additional validation at display level
    if (!issue.student_id || issue.student_id === 'Unknown' || issue.student_id === 'N/A') {
      return false;
    }
    
    const matchesSearch = (issue.course_code || '').toLowerCase().includes(resultSearch.toLowerCase()) ||
      (issue.student_id || '').includes(resultSearch) ||
      (issue.course_title && issue.course_title.toLowerCase().includes(resultSearch.toLowerCase())) ||
      (issue.description || '').toLowerCase().includes(resultSearch.toLowerCase());
    const matchesFilter = resultFilter === 'all' || issue.status === resultFilter;
    return matchesSearch && matchesFilter;
  });

  const UserProfileModal = () => (
    <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)} maxWidth="md" fullWidth>
      <DialogTitle>Student Profile</DialogTitle>
      <DialogContent>
        {selectedUser && (() => {
          const mappedUser = mapUserFields(selectedUser);
          return (
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="h6" gutterBottom>Personal Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Full Name</Typography>
                    <Typography variant="body1">{mappedUser.fullName}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                    <Typography variant="body1">{mappedUser.email}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Typography variant="h6" gutterBottom>Academic Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Student ID</Typography>
                    <Typography variant="body1">{mappedUser.studentId}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Faculty</Typography>
                    <Typography variant="body1">{mappedUser.faculty}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Group</Typography>
                    <Typography variant="body1">{mappedUser.group}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Programme</Typography>
                    <Typography variant="body1">{mappedUser.programme}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Level</Typography>
                    <Typography variant="body1">{mappedUser.level}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Semester</Typography>
                    <Typography variant="body1">{mappedUser.semester}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Session</Typography>
                    <Typography variant="body1">{mappedUser.session}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Stack>
          );
        })()}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSelectedUser(null)}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  const ResultIssueModal = () => (
    <Dialog open={!!selectedResultIssue} onClose={() => setSelectedResultIssue(null)} maxWidth="md" fullWidth>
      <DialogTitle>Result Issue Details</DialogTitle>
      <DialogContent>
        {selectedResultIssue && (
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Course Code</Typography>
                <Typography variant="body1">{selectedResultIssue.course_code || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Course Title</Typography>
                <Typography variant="body1">
                  {selectedResultIssue.course_title || selectedResultIssue.courseTitle || selectedResultIssue.course_name || 'N/A'}
                </Typography>
                {/* Debug info - remove in production */}
                {typeof window !== 'undefined' && window.location.hostname === 'localhost' && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    Debug: course_title="{selectedResultIssue.course_title}", courseTitle="{selectedResultIssue.courseTitle}"
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Lecturer Name</Typography>
                <Typography variant="body1">{selectedResultIssue.lecturer_name || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Status</Typography>
                <Chip 
                  label={selectedResultIssue.status || 'pending'} 
                  color={getStatusColor(selectedResultIssue.status) as any}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Date Submitted</Typography>
                <Typography variant="body1">
                  {selectedResultIssue.date_submitted ? new Date(selectedResultIssue.date_submitted).toLocaleString() : 'N/A'}
                </Typography>
              </Grid>
            </Grid>
            
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>Description</Typography>
              <Typography variant="body1">{selectedResultIssue.description || 'No description provided'}</Typography>
            </Box>

            {selectedResultIssue.comment && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>Additional Comment</Typography>
                <Typography variant="body1">{selectedResultIssue.comment}</Typography>
              </Box>
            )}

            <Box>
              <Typography variant="h6" gutterBottom>Student Information</Typography>
              {(() => {
                const student = currentUsers.find(u => u.studentId === selectedResultIssue.student_id);
                return student ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Full Name</Typography>
                      <Typography variant="body1">{student.full_name || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Student ID</Typography>
                      <Typography variant="body1">{student.studentId || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Email</Typography>
                      <Typography variant="body1">{student.email || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Programme</Typography>
                      <Typography variant="body1">{student.programme || 'N/A'}</Typography>
                    </Grid>
                  </Grid>
                ) : (
                  <Typography variant="body2" color="text.secondary">Student profile not found</Typography>
                );
              })()}
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>Admin Logs</Typography>
              <Paper variant="outlined" sx={{ p: 2, maxHeight: 200, overflow: 'auto' }}>
                {selectedResultIssue.admin_logs && selectedResultIssue.admin_logs.length > 0 ? (
                  selectedResultIssue.admin_logs.map((log: string, index: number) => (
                    <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                      {log}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">No admin activity yet.</Typography>
                )}
              </Paper>
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSelectedResultIssue(null)}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  const ComplaintModal = () => (
    <Dialog open={!!selectedComplaint} onClose={() => setSelectedComplaint(null)} maxWidth="md" fullWidth>
      <DialogTitle>Complaint Details</DialogTitle>
      <DialogContent>
        {selectedComplaint && (
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Subject</Typography>
                <Typography variant="body1">{selectedComplaint.subject || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Type</Typography>
                <Typography variant="body1">{selectedComplaint.type || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Status</Typography>
                <Chip 
                  label={selectedComplaint.status || 'pending'} 
                  color={getStatusColor(selectedComplaint.status) as any}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Date Submitted</Typography>
                <Typography variant="body1">
                  {selectedComplaint.date_submitted ? new Date(selectedComplaint.date_submitted).toLocaleString() : 'N/A'}
                </Typography>
              </Grid>
            </Grid>
            
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>Description</Typography>
              <Typography variant="body1">{selectedComplaint.description || selectedComplaint.text || 'No description provided'}</Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>Student Information</Typography>
              {(() => {
                const student = currentUsers.find(u => u.studentId === selectedComplaint.student_id);
                return student ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Full Name</Typography>
                      <Typography variant="body1">{student.full_name || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Student ID</Typography>
                      <Typography variant="body1">{student.studentId || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Email</Typography>
                      <Typography variant="body1">{student.email || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Department</Typography>
                      <Typography variant="body1">{student.department || 'N/A'}</Typography>
                    </Grid>
                  </Grid>
                ) : (
                  <Typography variant="body2" color="text.secondary">Student profile not found</Typography>
                );
              })()}
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>Admin Logs</Typography>
              <Paper variant="outlined" sx={{ p: 2, maxHeight: 200, overflow: 'auto' }}>
                {selectedComplaint.admin_logs && selectedComplaint.admin_logs.length > 0 ? (
                  selectedComplaint.admin_logs.map((log: string, index: number) => (
                    <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                      {log}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">No admin activity yet.</Typography>
                )}
              </Paper>
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSelectedComplaint(null)}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <ThemeProvider theme={currentTheme}>
      <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <img src="/gctu.png" alt="GCTU Logo" style={{ width: 40, height: 40, marginRight: 16, borderRadius: '50%' }} />
              <Box>
                <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                  QUEUEUP Admin ({adminRole})
                </Typography>
                <Typography variant="caption" color="inherit" sx={{ opacity: 0.7 }}>
                  GCTU
                </Typography>
              </Box>
            </Box>
            <ExcelExportButton
              users={currentUsers}
              complaints={currentComplaints}
              resultIssues={currentResultIssues}
              adminRole={adminRole}
            />
            <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <Button color="inherit" startIcon={<LogoutIcon />}>
              Log out
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Dashboard Overview" />
            <Tab label="User Management" />
            <Tab label="Complaints" />
            <Tab label="Inactive" />
            <Tab label="Result Issues" />
            {isSuperAdmin && <Tab label="Admin Management" />}
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Total Users</Typography>
                    <Typography variant="h3" color="primary">{currentUsers.length}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>My Queue</Typography>
                    <Typography variant="h3" color="primary">
                      {getFilteredComplaintsByRole(currentComplaints, adminRole).length + currentResultIssues.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>My Pending Complaints</Typography>
                    <Typography variant="h3" color="primary">
                      {getFilteredComplaintsByRole(currentComplaints, adminRole).filter(c => c.status === 'pending' || c.status === 'Queued').length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <ActivityFeed maxItems={20} showExpanded={false} />
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6">All Users ({filteredUsers.length})</Typography>
                  <TextField
                    size="small"
                    placeholder="Search by name or ID..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    sx={{ width: 300 }}
                  />
                </Stack>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Student ID</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Join Date</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.uid}>
                          <TableCell>{user.name || user.full_name || 'N/A'}</TableCell>
                          <TableCell>{user.studentId || user.studentID || 'N/A'}</TableCell>
                          <TableCell>{user.role || 'Student'}</TableCell>
                          <TableCell>
                            {user.timestamp ? new Date(user.timestamp).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label="✓ Verified" 
                              color="success" 
                              size="small"
                              sx={{ fontSize: '0.75rem' }}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<VisibilityIcon />}
                              onClick={() => setSelectedUser(user)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6">All Complaints ({filteredComplaints.length})</Typography>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      size="small"
                      placeholder="Search subject or student id..."
                      value={complaintSearch}
                      onChange={(e) => setComplaintSearch(e.target.value)}
                      sx={{ width: 300 }}
                    />
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Filter</InputLabel>
                      <Select
                        value={complaintFilter}
                        onChange={(e) => setComplaintFilter(e.target.value)}
                        label="Filter"
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="in_progress">In Progress</MenuItem>
                        <MenuItem value="resolved">Resolved</MenuItem>
                        <MenuItem value="deleted">Deleted</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </Stack>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Subject</TableCell>
                        <TableCell>Student</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredComplaints.map((complaint) => (
                        <TableRow key={complaint.id}>
                          <TableCell>{complaint.subject}</TableCell>
                          <TableCell>{complaint.student_id}</TableCell>
                          <TableCell>{complaint.type}</TableCell>
                          <TableCell>
                            <Chip 
                              label={complaint.status} 
                              color={getStatusColor(complaint.status) as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{new Date(complaint.date_submitted).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Button
                                size="small"
                                startIcon={<VisibilityIcon />}
                                onClick={() => setSelectedComplaint(complaint)}
                              >
                                View
                              </Button>
                              <Button 
                                size="small" 
                                startIcon={<EditIcon />} 
                                color="primary"
                                onClick={() => logAdminAction('complaint', complaint.id || complaint.unique_id, 'marked as in progress', 'in_progress')}
                              >
                                In Progress
                              </Button>
                              <Button 
                                size="small" 
                                startIcon={<CheckCircleIcon />} 
                                color="success"
                                onClick={() => logAdminAction('complaint', complaint.id || complaint.unique_id, 'resolved complaint', 'resolved')}
                              >
                                Resolve
                              </Button>
                              <Button 
                                size="small" 
                                startIcon={<DeleteIcon />} 
                                color="error"
                                onClick={() => logAdminAction('complaint', complaint.id || complaint.unique_id, 'moved to inactive', 'inactive')}
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
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Inactive Items ({mockInactiveItems.length})</Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Complaints and result issues that have been marked as inactive. Items will be automatically permanently deleted after 30 days. You can restore items before they are permanently deleted.
                </Alert>
                {mockInactiveItems.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Type</TableCell>
                          <TableCell>Subject/Course</TableCell>
                          <TableCell>Student</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Days Until Deletion</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mockInactiveItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Chip 
                                label={item.type === 'complaint' ? 'Complaint' : 'Result Issue'} 
                                color={item.type === 'complaint' ? 'primary' : 'secondary'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              {item.type === 'complaint' ? item.subject : item.course_code}
                            </TableCell>
                            <TableCell>{item.student_id}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>
                              <Chip 
                                label={`${item.days_until_permanent_deletion} days`}
                                color={item.days_until_permanent_deletion <= 7 ? 'error' : 'warning'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                size="small"
                                variant="outlined"
                                color="success"
                                onClick={() => {
                                  // Handle restore functionality
                                  console.log('Restoring item:', item.id);
                                }}
                              >
                                Restore
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No inactive items found.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6">All Result Issues ({filteredResultIssues.length})</Typography>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      size="small"
                      placeholder="Search course or student id..."
                      value={resultSearch}
                      onChange={(e) => setResultSearch(e.target.value)}
                      sx={{ width: 300 }}
                    />
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Filter</InputLabel>
                      <Select
                        value={resultFilter}
                        onChange={(e) => setResultFilter(e.target.value)}
                        label="Filter"
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="Queued">Queued</MenuItem>
                        <MenuItem value="in_progress">In Progress</MenuItem>
                        <MenuItem value="resolved">Resolved</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </Stack>
                <TableContainer>
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
                      {filteredResultIssues.map((issue) => (
                        <TableRow key={issue.id}>
                          <TableCell>
                            <Stack>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {issue.course_code}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {issue.course_title || 'N/A'}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>{issue.student_id}</TableCell>
                          <TableCell>{issue.description}</TableCell>
                          <TableCell>
                            <Chip 
                              label={issue.status} 
                              color={getStatusColor(issue.status) as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{new Date(issue.date_submitted).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Button 
                                size="small" 
                                startIcon={<VisibilityIcon />}
                                onClick={() => setSelectedResultIssue(issue)}
                              >
                                View
                              </Button>
                              <Button 
                                size="small" 
                                startIcon={<EditIcon />} 
                                color="primary"
                                onClick={() => logAdminAction('result_issue', issue.id || issue.unique_id, 'marked as in progress', 'in_progress')}
                              >
                                In Progress
                              </Button>
                              <Button 
                                size="small" 
                                startIcon={<CheckCircleIcon />} 
                                color="success"
                                onClick={() => logAdminAction('result_issue', issue.id || issue.unique_id, 'resolved result issue', 'resolved')}
                              >
                                Resolve
                              </Button>
                              <Button 
                                size="small" 
                                startIcon={<DeleteIcon />} 
                                color="error"
                                onClick={() => logAdminAction('result_issue', issue.id || issue.unique_id, 'moved to inactive', 'inactive')}
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
              </CardContent>
            </Card>
          </TabPanel>

          {isSuperAdmin && (
            <TabPanel value={tabValue} index={5}>
              <Card>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h6">Admin Management</Typography>
                    <Button 
                      variant="contained" 
                      onClick={() => setCreateAdminOpen(true)}
                      startIcon={<EditIcon />}
                    >
                      Create New Admin
                    </Button>
                  </Stack>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Email</TableCell>
                          <TableCell>Role</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Created Date</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>admin@gctu.edu.gh</TableCell>
                          <TableCell>SuperAdmin</TableCell>
                          <TableCell>
                            <Chip label="Active" color="success" size="small" />
                          </TableCell>
                          <TableCell>2024-01-01</TableCell>
                          <TableCell>
                            <Button size="small" startIcon={<EditIcon />}>
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>hod@gctu.edu.gh</TableCell>
                          <TableCell>HOD</TableCell>
                          <TableCell>
                            <Chip label="Active" color="success" size="small" />
                          </TableCell>
                          <TableCell>2024-01-15</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Button size="small" startIcon={<EditIcon />}>
                                Edit
                              </Button>
                              <Button size="small" startIcon={<DeleteIcon />} color="error">
                                Delete
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </TabPanel>
          )}
        </Container>

        <UserProfileModal 
          user={selectedUser}
          open={!!selectedUser}
          onClose={() => setSelectedUser(null)}
        />
        <ComplaintModal />
        <ResultIssueModal
          issue={selectedResultIssue}
          student={selectedResultIssue ? currentUsers.find(u => u.studentId === selectedResultIssue.student_id) || null : null}
          open={!!selectedResultIssue}
          onClose={() => setSelectedResultIssue(null)}
        />
        
        {/* Create Admin Modal */}
        <Dialog open={createAdminOpen} onClose={() => setCreateAdminOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New Admin</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newAdminData.email}
                onChange={(e) => setNewAdminData({...newAdminData, email: e.target.value})}
                placeholder="admin@gctu.edu.gh"
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={newAdminData.role}
                  onChange={(e) => setNewAdminData({...newAdminData, role: e.target.value})}
                  label="Role"
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="HOD">Head of Department</MenuItem>
                  <MenuItem value="Exam Officer">Exam Officer</MenuItem>
                  <MenuItem value="Dean">Dean</MenuItem>
                  <MenuItem value="Registrar">Registrar</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Temporary Password"
                type="password"
                value={newAdminData.password}
                onChange={(e) => setNewAdminData({...newAdminData, password: e.target.value})}
                placeholder="Temporary password"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateAdminOpen(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={() => {
                console.log('Creating admin:', newAdminData);
                setCreateAdminOpen(false);
                setNewAdminData({ email: '', role: 'Admin', password: '' });
              }}
            >
              Create Admin
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboard;
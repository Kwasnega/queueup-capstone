import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextareaAutosize,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Paper,
  Grid
} from '@mui/material';
import {
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  Assignment as AssignmentIcon,
  Report as ReportIcon,
  TrackChanges as TrackChangesIcon,
  Timeline as TimelineIcon,
  Delete as DeleteIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  getDatabase, 
  ref, 
  push, 
  set, 
  onValue, 
  get, 
  update, 
  off, 
  remove,
  DatabaseReference 
} from 'firebase/database';
import { firebaseConfig } from '../../firebase_config.js';
import TrackingModal from './TrackingModal';
import { useFirebaseListenerManager } from './FirebaseListenerManager';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
  },
}));

const ProfileCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  border: '1px solid #e5e7eb',
}));

const StatusPill = styled(Chip)<{ status: string }>(({ theme, status }) => {
  const getStatusColors = (status: string) => {
    switch (status.toLowerCase().replace(/\s/g, '')) {
      case 'queued':
        return { background: '#bfdbfe', color: '#1e3a8a' };
      case 'inprogress':
        return { background: '#fef3c7', color: '#713f12' };
      case 'resolved':
        return { background: '#dcfce7', color: '#14532d' };
      case 'closed':
        return { background: '#e5e7eb', color: '#374151' };
      case 'inactive':
        return { background: '#f3f4f6', color: '#6b7280' };
      default:
        return { background: '#f3f4f6', color: '#6b7280' };
    }
  };

  const colors = getStatusColors(status);
  return {
    backgroundColor: colors.background,
    color: colors.color,
    fontWeight: 700,
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    },
  };
});

// Types
interface UserProfile {
  uid?: string;
  studentId: string;
  email: string;
  full_name: string;
  faculty?: string;
  department?: string;
  programme?: string;
  level?: string;
  semester?: string;
  session?: string;
}

interface Complaint {
  id: string;
  subject: string;
  type: string;
  status: string;
  student_id: string;
  text: string;
  date_submitted: string;
  admin_logs?: string[];
}

interface ResultIssue {
  id: string;
  course_code: string;
  course_title: string;
  student_id: string;
  description: string;
  status: string;
  date_submitted: string;
  admin_logs?: string[];
  lecturer_name?: string;
}

interface Notification {
  id: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

// Faculty programmes mapping
const facultyProgrammes = {
  "Faculty of Computing & Information Systems (FoCIS)": [
    "BSc Information Technology", "BSc Mobile Computing", "BSc Information Systems",
    "BSc Computer Science", "BSc Computer Science (Cybersecurity option)", "BSc Data Science and Analytics",
    "BSc Network and Systems", "BSc Software Engineering", "BSc Internet of Things and Big Data"
  ],
  "Faculty of Engineering (FoE)": [
    "BSc Telecommunications Engineering", "BSc Computer Engineering", "BSc Electrical & Electronic Engineering",
    "BSc Mathematics", "Diploma in Telecommunications Engineering"
  ],
  "GCTU Business School": [
    "BSc Accounting with Computing", "BSc Economics", "BSc Procurement and Logistics",
    "BSc Banking and Finance", "BSc E-Commerce & Marketing Management",
    "BSc Business Administration with options in HRM, Marketing, Accounting, Management",
    "Diploma in Public Relations", "Diploma in Management", "Diploma in Accounting option", "Diploma in Marketing option"
  ]
};

const DashboardContainer: React.FC = () => {
  // State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [resultIssues, setResultIssues] = useState<ResultIssue[]>([]);
  
  // Modal states
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [resultIssueModalOpen, setResultIssueModalOpen] = useState(false);
  const [complaintModalOpen, setComplaintModalOpen] = useState(false);
  const [trackComplaintsModalOpen, setTrackComplaintsModalOpen] = useState(false);
  const [trackResultsModalOpen, setTrackResultsModalOpen] = useState(false);
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  
  // Form states
  const [resultIssueForm, setResultIssueForm] = useState({
    course_code: '',
    course_title: '',
    lecturer_name: '',
    description: '',
    comment: ''
  });
  
  const [complaintForm, setComplaintForm] = useState({
    subject: '',
    type: '',
    recipient: 'General',
    message: ''
  });
  
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    faculty: '',
    programme: '',
    department: '',
    level: '',
    semester: '',
    session: ''
  });
  
  // UI states
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' as 'success' | 'error' | 'info' });
  const [loading, setLoading] = useState(false);
  const [selectedProgressItem, setSelectedProgressItem] = useState<any>(null);
  
  // Use Firebase listener manager for proper cleanup
  const listenerManager = useFirebaseListenerManager();

  // Helper functions
  const showSnackbar = useCallback((message: string, severity: 'success' | 'error' | 'info' = 'info') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const findProfileForUid = useCallback(async (uid: string): Promise<UserProfile | null> => {
    if (!uid) return null;
    try {
      const byUidSnap = await get(ref(db, `users_by_uid/${uid}`));
      if (byUidSnap.exists()) {
        return byUidSnap.val();
      }
      const usersSnap = await get(ref(db, `users`));
      if (usersSnap.exists()) {
        const allUsers = usersSnap.val();
        for (const key of Object.keys(allUsers)) {
          const u = allUsers[key];
          if (u && (u.uid === uid || u.uid === uid.toString())) {
            return {
              studentId: u.studentId || u.student_id || key,
              email: u.email || u.email_address || '',
              full_name: u.full_name || u.name || '',
              department: u.department || '',
              faculty: u.faculty || '',
              programme: u.programme || '',
              level: u.level || '',
              semester: u.semester || '',
              session: u.session || ''
            };
          }
        }
      }
    } catch (err) {
      console.error('findProfileForUid error', err);
    }
    return null;
  }, []);

  // Setup real-time listeners using the listener manager
  const setupRealtimeListeners = useCallback((uid: string, studentId: string) => {
    // Clear existing listeners first
    listenerManager.removeAllListeners();

    // Add a small delay to ensure cleanup is complete
    setTimeout(() => {
      try {
        // Setup complaints listener
        const complaintsRef = ref(db, `complaints/${studentId}`);
        const complaintsUnsubscribe = onValue(complaintsRef, (snapshot) => {
          try {
            if (snapshot.exists()) {
              const data = snapshot.val();
              const complaintsArray = Object.entries(data).map(([id, complaint]: [string, any]) => ({
                id,
                ...complaint
              }));
              setComplaints(complaintsArray);
            } else {
              setComplaints([]);
            }
          } catch (processingError) {
            console.error('Error processing complaints snapshot:', processingError);
            setComplaints([]);
          }
        }, (error) => {
          console.error('Complaints listener error:', error);
          setComplaints([]);
        });
        listenerManager.addListener(`complaints-${studentId}`, complaintsUnsubscribe);

        // Setup result issues listener
        const resultsRef = ref(db, `result_issues/${studentId}`);
        const resultsUnsubscribe = onValue(resultsRef, (snapshot) => {
          try {
            if (snapshot.exists()) {
              const data = snapshot.val();
              const resultsArray = Object.entries(data).map(([id, result]: [string, any]) => ({
                id,
                ...result
              }));
              setResultIssues(resultsArray);
            } else {
              setResultIssues([]);
            }
          } catch (processingError) {
            console.error('Error processing results snapshot:', processingError);
            setResultIssues([]);
          }
        }, (error) => {
          console.error('Results listener error:', error);
          setResultIssues([]);
        });
        listenerManager.addListener(`results-${studentId}`, resultsUnsubscribe);

        // Setup notifications listener
        const notificationsRef = ref(db, `notifications/${uid}`);
        const notificationsUnsubscribe = onValue(notificationsRef, (snapshot) => {
          try {
            if (snapshot.exists()) {
              const data = snapshot.val();
              const notificationsArray = Object.entries(data).map(([id, notification]: [string, any]) => ({
                id,
                ...notification
              }));
              setNotifications(notificationsArray.sort((a, b) => 
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
              ));
            } else {
              setNotifications([]);
            }
          } catch (processingError) {
            console.error('Error processing notifications snapshot:', processingError);
            setNotifications([]);
          }
        }, (error) => {
          console.error('Notifications listener error:', error);
          setNotifications([]);
        });
        listenerManager.addListener(`notifications-${uid}`, notificationsUnsubscribe);

      } catch (setupError) {
        console.error('Error setting up real-time listeners:', setupError);
        listenerManager.removeAllListeners();
      }
    }, 100);
  }, [listenerManager]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const userProfile = await findProfileForUid(user.uid);
        if (userProfile) {
          setProfile(userProfile);
          setProfileForm({
            full_name: userProfile.full_name || '',
            faculty: userProfile.faculty || '',
            programme: userProfile.programme || '',
            department: userProfile.department || '',
            level: userProfile.level || '',
            semester: userProfile.semester || '',
            session: userProfile.session || ''
          });
          setupRealtimeListeners(user.uid, userProfile.studentId);
        }
      } else {
        // Redirect to login if no user
        window.location.href = '/login.html';
      }
    });

    return () => {
      unsubscribe();
      // Cleanup listeners using the manager
      listenerManager.removeAllListeners();
    };
  }, [findProfileForUid, setupRealtimeListeners, listenerManager]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      showSnackbar('Signed out successfully', 'info');
      setTimeout(() => window.location.href = '/login.html', 700);
    } catch (error) {
      console.error('Logout error:', error);
      showSnackbar('Sign out failed', 'error');
    }
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    if (!currentUser || !profile) return;
    
    setLoading(true);
    try {
      const updatedProfile = {
        ...profileForm,
        studentId: profile.studentId,
        uid: currentUser.uid,
        email: currentUser.email,
        studentID: profile.studentId,
        student_id: profile.studentId,
        group: profileForm.department,
        updatedAt: new Date().toISOString()
      };
      
      const userByUidRef = ref(db, `users_by_uid/${currentUser.uid}`);
      const userByStudentIdRef = ref(db, `users/${profile.studentId}`);
      
      await update(userByUidRef, updatedProfile);
      await update(userByStudentIdRef, updatedProfile);
      
      setProfile({ ...profile, ...updatedProfile });
      showSnackbar('Profile updated successfully!', 'success');
      setProfileModalOpen(false);
    } catch (error) {
      console.error('Profile update error:', error);
      showSnackbar('Error updating profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle result issue submission
  const handleResultIssueSubmit = async () => {
    if (!profile || !currentUser) return;
    
    // Validate required fields
    if (!resultIssueForm.course_code.trim() || !resultIssueForm.course_title.trim() || !resultIssueForm.description) {
      showSnackbar('Please fill in course code, course title, and issue description', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const resultData = {
        student_id: profile.studentId,
        studentId: profile.studentId, // Alternative field name for compatibility
        faculty: profile.faculty || '',
        department: profile.department || '',
        programme: profile.programme || '',
        session: profile.session || '',
        course_code: resultIssueForm.course_code.trim(),
        course_title: resultIssueForm.course_title.trim(), // Primary field
        courseTitle: resultIssueForm.course_title.trim(), // Alternative field name for compatibility
        course_name: resultIssueForm.course_title.trim(), // Another alternative
        lecturer_name: resultIssueForm.lecturer_name.trim(),
        description: resultIssueForm.description,
        comment: resultIssueForm.comment.trim(),
        date_submitted: new Date().toISOString(),
        status: 'Queued',
        admin_logs: [] // Initialize admin logs array
      };

      // Create in both flat structure (for admin) and student-specific structure
      const newResultRef = push(ref(db, `result_issues`));
      const uniqueId = newResultRef.key;
      const resultDataWithId = { 
        ...resultData, 
        id: uniqueId,
        unique_id: uniqueId, // Ensure consistent ID reference
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('Saving result issue with data:', resultDataWithId);
      
      // Save to flat structure for admin access
      await set(newResultRef, resultDataWithId);
      
      // Save to student-specific structure for tracking
      const studentResultRef = ref(db, `result_issues/${profile.studentId}/${uniqueId}`);
      await set(studentResultRef, resultDataWithId);

      // Add notification
      await push(ref(db, `notifications/${currentUser.uid}`), {
        message: 'Results issue submitted successfully',
        created_at: new Date().toISOString(),
        is_read: false
      });

      showSnackbar('Results issue submitted successfully', 'success');
      setResultIssueForm({
        course_code: '',
        course_title: '',
        lecturer_name: '',
        description: '',
        comment: ''
      });
      setResultIssueModalOpen(false);
    } catch (error) {
      console.error('Result issue submission error:', error);
      showSnackbar('Error submitting results issue', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle complaint submission
  const handleComplaintSubmit = async () => {
    if (!profile || !currentUser) return;
    
    if (!complaintForm.subject || !complaintForm.type || !complaintForm.message) {
      showSnackbar('Please fill all required fields', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const complaintData = {
        student_id: profile.studentId,
        user_uid: currentUser.uid,
        subject: complaintForm.subject.trim(),
        type: complaintForm.type,
        recipient: complaintForm.recipient,
        text: complaintForm.message.trim(),
        status: 'Queued',
        date_submitted: new Date().toISOString(),
        department: profile.department || 'N/A',
        programme: profile.programme || 'N/A',
        level: profile.level || 'N/A',
        session: profile.session || 'N/A',
        faculty: profile.faculty || 'N/A',
        admin_route: complaintForm.recipient !== 'General' ? complaintForm.recipient.toLowerCase() : 'general'
      };

      // Create in both flat structure (for admin) and student-specific structure
      const newComplaintRef = push(ref(db, `complaints`));
      const uniqueId = newComplaintRef.key;
      const complaintDataWithId = { 
        ...complaintData, 
        id: uniqueId,
        unique_id: uniqueId, // Ensure consistent ID reference
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Save to flat structure for admin access
      await set(newComplaintRef, complaintDataWithId);
      
      // Save to student-specific structure for tracking
      const studentComplaintRef = ref(db, `complaints/${profile.studentId}/${uniqueId}`);
      await set(studentComplaintRef, complaintDataWithId);

      // Add notification
      await push(ref(db, `notifications/${currentUser.uid}`), {
        message: 'Complaint submitted successfully',
        created_at: new Date().toISOString(),
        is_read: false
      });

      showSnackbar('Complaint submitted successfully', 'success');
      setComplaintForm({
        subject: '',
        type: '',
        recipient: 'General',
        message: ''
      });
      setComplaintModalOpen(false);
    } catch (error) {
      console.error('Complaint submission error:', error);
      showSnackbar('Error submitting complaint', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete item
  const handleDeleteItem = async (type: 'complaint' | 'result', id: string) => {
    if (!profile) return;
    
    try {
      if (type === 'complaint') {
        await remove(ref(db, `complaints/${id}`));
        await remove(ref(db, `complaints/${profile.studentId}/${id}`));
        showSnackbar('Complaint deleted successfully', 'success');
      } else {
        await remove(ref(db, `result_issues/${id}`));
        await remove(ref(db, `result_issues/${profile.studentId}/${id}`));
        showSnackbar('Result issue deleted successfully', 'success');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showSnackbar('Error deleting item', 'error');
    }
  };

  // Handle mark all notifications as read
  const handleMarkAllNotificationsRead = async () => {
    if (!currentUser) return;
    
    try {
      const notificationsRef = ref(db, `notifications/${currentUser.uid}`);
      const snapshot = await get(notificationsRef);
      if (snapshot.exists()) {
        const updates: { [key: string]: boolean } = {};
        Object.keys(snapshot.val()).forEach(key => {
          updates[`${key}/is_read`] = true;
        });
        await update(notificationsRef, updates);
      }
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.is_read).length;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f0f2f5', fontFamily: 'Inter, sans-serif' }}>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Header */}
        <AppBar position="static" elevation={0} sx={{ borderRadius: '16px', mb: 3 }}>
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Avatar src="/gctu.png" sx={{ width: 40, height: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  Ghana Communication
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  Technology University (GCTU)
                </Typography>
              </Box>
            </Box>
            
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton onClick={() => setProfileModalOpen(true)} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}>
                <PersonIcon />
              </IconButton>
              
              <Box sx={{ position: 'relative' }}>
                <IconButton onClick={() => setNotificationModalOpen(true)}>
                  <NotificationsIcon />
                </IconButton>
                {unreadNotificationsCount > 0 && (
                  <Chip
                    label={unreadNotificationsCount}
                    size="small"
                    color="error"
                    sx={{
                      position: 'absolute',
                      top: -5,
                      right: -5,
                      height: 20,
                      minWidth: 20,
                      fontSize: '0.75rem'
                    }}
                  />
                )}
              </Box>
              
              <Button
                variant="contained"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{ borderRadius: '8px' }}
              >
                Log out
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>

        {/* Profile Card */}
        <ProfileCard>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ width: 48, height: 48, bgcolor: '#f3f4f6' }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {profile?.full_name ? `Hello, ${profile.full_name}` : 'Hello, Student'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile?.studentId || 'No ID'}
              </Typography>
            </Box>
          </Stack>
        </ProfileCard>

        {/* Academic Information */}
        <StyledCard sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Academic Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="text.secondary">Student ID</Typography>
                <Typography variant="body1">{profile?.studentId || '—'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="text.secondary">Faculty</Typography>
                <Typography variant="body1">{profile?.faculty || '—'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="text.secondary">Group</Typography>
                <Typography variant="body1">{profile?.department || '—'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="text.secondary">Programme</Typography>
                <Typography variant="body1">{profile?.programme || '—'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="text.secondary">Level</Typography>
                <Typography variant="body1">{profile?.level || '—'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="text.secondary">Semester</Typography>
                <Typography variant="body1">{profile?.semester || '—'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="body2" color="text.secondary">Session</Typography>
                <Typography variant="body1">{profile?.session || '—'}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </StyledCard>

        {/* Action Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StyledCard sx={{ cursor: 'pointer' }} onClick={() => setResultIssueModalOpen(true)}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  bgcolor: '#eef2ff', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 1
                }}>
                  <AssignmentIcon sx={{ color: 'primary.main' }} />
                </Box>
                <Typography variant="h6" gutterBottom>Report Results Issue</Typography>
                <Typography variant="body2" color="text.secondary">
                  Report missing or incorrect grades
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StyledCard sx={{ cursor: 'pointer' }} onClick={() => setComplaintModalOpen(true)}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  bgcolor: '#eef2ff', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 1
                }}>
                  <ReportIcon sx={{ color: 'primary.main' }} />
                </Box>
                <Typography variant="h6" gutterBottom>Make a Complaint</Typography>
                <Typography variant="body2" color="text.secondary">
                  Report any non-academic issues
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StyledCard sx={{ cursor: 'pointer' }} onClick={() => setTrackComplaintsModalOpen(true)}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  bgcolor: '#eef2ff', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 1
                }}>
                  <TrackChangesIcon sx={{ color: 'primary.main' }} />
                </Box>
                <Typography variant="h6" gutterBottom>Track Complaint</Typography>
                <Typography variant="body2" color="text.secondary">
                  See progress on your submitted complaints
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StyledCard sx={{ cursor: 'pointer' }} onClick={() => setTrackResultsModalOpen(true)}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  bgcolor: '#eef2ff', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 1
                }}>
                  <TimelineIcon sx={{ color: 'primary.main' }} />
                </Box>
                <Typography variant="h6" gutterBottom>Track Results Issue</Typography>
                <Typography variant="body2" color="text.secondary">
                  See progress on reported results issues
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>

        {/* Profile Modal */}
        <Dialog open={profileModalOpen} onClose={() => setProfileModalOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Edit Your Profile</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Full Name"
                value={profileForm.full_name}
                onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                fullWidth
              />
              
              <TextField
                label="Student ID"
                value={profile?.studentId || ''}
                disabled
                fullWidth
              />
              
              <FormControl fullWidth>
                <InputLabel>Faculty</InputLabel>
                <Select
                  value={profileForm.faculty}
                  onChange={(e) => {
                    setProfileForm({ ...profileForm, faculty: e.target.value, programme: '' });
                  }}
                  label="Faculty"
                >
                  <MenuItem value="">-- Select a Faculty --</MenuItem>
                  {Object.keys(facultyProgrammes).map(faculty => (
                    <MenuItem key={faculty} value={faculty}>{faculty}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Programme</InputLabel>
                <Select
                  value={profileForm.programme}
                  onChange={(e) => setProfileForm({ ...profileForm, programme: e.target.value })}
                  label="Programme"
                  disabled={!profileForm.faculty}
                >
                  <MenuItem value="">-- Select a Programme --</MenuItem>
                  {profileForm.faculty && facultyProgrammes[profileForm.faculty as keyof typeof facultyProgrammes]?.map(programme => (
                    <MenuItem key={programme} value={programme}>{programme}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Group</InputLabel>
                <Select
                  value={profileForm.department}
                  onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                  label="Group"
                >
                  {Array.from({ length: 16 }, (_, i) => String.fromCharCode(65 + i)).map(letter => (
                    <MenuItem key={letter} value={`Group ${letter}`}>Group {letter}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Level</InputLabel>
                <Select
                  value={profileForm.level}
                  onChange={(e) => setProfileForm({ ...profileForm, level: e.target.value })}
                  label="Level"
                >
                  {['Level 100', 'Level 200', 'Level 300', 'Level 400'].map(level => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Current Semester</InputLabel>
                <Select
                  value={profileForm.semester}
                  onChange={(e) => setProfileForm({ ...profileForm, semester: e.target.value })}
                  label="Current Semester"
                >
                  <MenuItem value="First Semester">First Semester</MenuItem>
                  <MenuItem value="Second Semester">Second Semester</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Session</InputLabel>
                <Select
                  value={profileForm.session}
                  onChange={(e) => setProfileForm({ ...profileForm, session: e.target.value })}
                  label="Session"
                >
                  <MenuItem value="Morning">Morning</MenuItem>
                  <MenuItem value="Evening">Evening</MenuItem>
                  <MenuItem value="Weekend">Weekend</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setProfileModalOpen(false)}>Cancel</Button>
            <Button onClick={handleProfileUpdate} variant="contained" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notifications Modal */}
        <Dialog open={notificationModalOpen} onClose={() => setNotificationModalOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Notifications</Typography>
              <IconButton onClick={() => setNotificationModalOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
              {notifications.length > 0 ? (
                <List>
                  {notifications.map((notification) => (
                    <React.Fragment key={notification.id}>
                      <ListItem
                        sx={{
                          bgcolor: notification.is_read ? 'transparent' : 'action.hover',
                          borderRadius: 1,
                          mb: 1
                        }}
                      >
                        <ListItemText
                          primary={notification.message}
                          secondary={new Date(notification.created_at).toLocaleString()}
                          primaryTypographyProps={{
                            fontWeight: notification.is_read ? 'normal' : 'bold'
                          }}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No notifications yet.
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleMarkAllNotificationsRead}>Mark All As Read</Button>
            <Button onClick={() => setNotificationModalOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Result Issue Modal */}
        <Dialog open={resultIssueModalOpen} onClose={() => setResultIssueModalOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Report Results Issue</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Student ID"
                value={profile?.studentId || ''}
                disabled
                fullWidth
              />
              
              <TextField
                label="Faculty"
                value={profile?.faculty || ''}
                disabled
                fullWidth
              />
              
              <TextField
                label="Group"
                value={profile?.department || ''}
                disabled
                fullWidth
              />
              
              <TextField
                label="Programme"
                value={profile?.programme || ''}
                disabled
                fullWidth
              />
              
              <TextField
                label="Session"
                value={profile?.session || ''}
                disabled
                fullWidth
              />
              
              <TextField
                label="Course Code *"
                placeholder="e.g., CBT 101"
                value={resultIssueForm.course_code}
                onChange={(e) => setResultIssueForm({ ...resultIssueForm, course_code: e.target.value })}
                fullWidth
                required
              />
              
              <TextField
                label="Course Title *"
                placeholder="e.g., Introduction to Computing"
                value={resultIssueForm.course_title}
                onChange={(e) => setResultIssueForm({ ...resultIssueForm, course_title: e.target.value })}
                fullWidth
                required
                helperText="Please enter the full course title as it appears on your transcript"
              />
              
              <TextField
                label="Name of Lecturer"
                placeholder="e.g., Dr. Gideon Genius"
                value={resultIssueForm.lecturer_name}
                onChange={(e) => setResultIssueForm({ ...resultIssueForm, lecturer_name: e.target.value })}
                fullWidth
              />
              
              <FormControl fullWidth required>
                <InputLabel>Issue Description</InputLabel>
                <Select
                  value={resultIssueForm.description}
                  onChange={(e) => setResultIssueForm({ ...resultIssueForm, description: e.target.value })}
                  label="Issue Description"
                >
                  <MenuItem value="">Select an issue</MenuItem>
                  <MenuItem value="Missing Grade">Missing Grade</MenuItem>
                  <MenuItem value="Discrepancy in Grade">Discrepancy in Grade</MenuItem>
                  <MenuItem value="Incorrect Course Registration">Incorrect Course Registration</MenuItem>
                  <MenuItem value="Not on Examination List">Not on Examination List</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                label="Any Comment? (optional)"
                placeholder="Add any additional details..."
                value={resultIssueForm.comment}
                onChange={(e) => setResultIssueForm({ ...resultIssueForm, comment: e.target.value })}
                multiline
                rows={4}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setResultIssueModalOpen(false)}>Cancel</Button>
            <Button onClick={handleResultIssueSubmit} variant="contained" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Results Issue'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Complaint Modal */}
        <Dialog open={complaintModalOpen} onClose={() => setComplaintModalOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Submit a Complaint</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Student ID"
                value={profile?.studentId || ''}
                disabled
                fullWidth
              />
              
              <TextField
                label="Complaint Subject *"
                placeholder="e.g., Timetable Clash"
                value={complaintForm.subject}
                onChange={(e) => setComplaintForm({ ...complaintForm, subject: e.target.value })}
                fullWidth
                required
              />
              
              <FormControl fullWidth required>
                <InputLabel>Complaint Type</InputLabel>
                <Select
                  value={complaintForm.type}
                  onChange={(e) => setComplaintForm({ ...complaintForm, type: e.target.value })}
                  label="Complaint Type"
                >
                  <MenuItem value="">Select a type</MenuItem>
                  <MenuItem value="Academic">Academic</MenuItem>
                  <MenuItem value="Administrative">Administrative</MenuItem>
                  <MenuItem value="Facilities">Facilities</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Submit To</InputLabel>
                <Select
                  value={complaintForm.recipient}
                  onChange={(e) => setComplaintForm({ ...complaintForm, recipient: e.target.value })}
                  label="Submit To"
                >
                  <MenuItem value="General">General (visible to all relevant admins)</MenuItem>
                  <MenuItem value="HOD">Head of Department (HOD)</MenuItem>
                  <MenuItem value="Registrar">Registrar</MenuItem>
                  <MenuItem value="Dean">Dean</MenuItem>
                  <MenuItem value="Exam Officer">Exam Officer</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                label="Complaint Message *"
                placeholder="Please describe your complaint in detail..."
                value={complaintForm.message}
                onChange={(e) => setComplaintForm({ ...complaintForm, message: e.target.value })}
                multiline
                rows={4}
                fullWidth
                required
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setComplaintModalOpen(false)}>Cancel</Button>
            <Button onClick={handleComplaintSubmit} variant="contained" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Track Complaints Modal */}
        <TrackingModal
          open={trackComplaintsModalOpen}
          onClose={() => setTrackComplaintsModalOpen(false)}
          type="complaints"
          studentId={profile?.studentId || ''}
          onProgressClick={(item) => {
            setSelectedProgressItem(item);
            setProgressModalOpen(true);
          }}
          onShowSnackbar={showSnackbar}
        />

        {/* Track Results Modal */}
        <TrackingModal
          open={trackResultsModalOpen}
          onClose={() => setTrackResultsModalOpen(false)}
          type="results"
          studentId={profile?.studentId || ''}
          onProgressClick={(item) => {
            setSelectedProgressItem(item);
            setProgressModalOpen(true);
          }}
          onShowSnackbar={showSnackbar}
        />

        {/* Progress Modal */}
        <ProgressModal
          open={progressModalOpen}
          onClose={() => setProgressModalOpen(false)}
          item={selectedProgressItem}
        />

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default DashboardContainer;
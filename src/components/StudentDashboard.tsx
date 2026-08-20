import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Avatar,
  Chip,
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
  List,
  ListItem,
  ListItemText,
  IconButton,
  Badge,
  Divider,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Person,
  Notifications,
  Assignment,
  Report,
  Track,
  Logout,
  Close,
  Delete
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useInactivityTimer } from '../hooks/useInactivityTimer';

const DashboardContainer = styled(Box)(({ theme }) => ({
  background: '#f0f2f5',
  minHeight: '100vh',
  padding: theme.spacing(2),
  fontFamily: 'Inter, sans-serif'
}));

const MainCard = styled(Card)(({ theme }) => ({
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  maxWidth: '1100px',
  margin: '0 auto',
  minHeight: '90vh'
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 3),
  borderBottom: `1px solid ${theme.palette.divider}`
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
}));

const ActionCard = styled(Card)(({ theme }) => ({
  background: '#f9fafb',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'transform 0.12s, box-shadow 0.2s',
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
  }
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'queued':
        return { background: '#bfdbfe', color: '#1e3a8a' };
      case 'in progress':
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

  const colors = getStatusColor(status);
  return {
    ...colors,
    fontWeight: 700,
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }
  };
});

interface StudentDashboardProps {
  user?: any;
  onLogout?: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onLogout }) => {
  const [profile, setProfile] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [resultIssues, setResultIssues] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error' | 'info'>('info');

  // Modal states
  const [profileForm, setProfileForm] = useState<any>({});
  const [complaintForm, setComplaintForm] = useState<any>({});
  const [resultForm, setResultForm] = useState<any>({});

  // Set up inactivity timer
  useInactivityTimer({
    user,
    onTimeout: () => {
      showToast('Logged out due to inactivity.', 'info');
      setTimeout(() => {
        if (onLogout) onLogout();
      }, 700);
    }
  });

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

  // Toast notification helper
  const showToast = useCallback((message: string, severity: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  }, []);

  const handleOpenModal = (modalType: string) => {
    setOpenModal(modalType);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
    setProgressData(null);
  };

  const handleCloseToast = () => {
    setToastOpen(false);
  };

  const handleSubmitComplaint = async () => {
    // Implementation for complaint submission
    console.log('Submitting complaint:', complaintForm);
    handleCloseModal();
  };

  const handleSubmitResultIssue = async () => {
    // Implementation for result issue submission
    console.log('Submitting result issue:', resultForm);
    handleCloseModal();
  };

  const handleShowProgress = async (type: string, itemId: string, status: string, title: string) => {
    // Implementation for showing progress modal
    setProgressData({ type, itemId, status, title });
    setOpenModal('progress');
  };

  const renderProfileModal = () => (
    <Dialog open={openModal === 'profile'} onClose={handleCloseModal} maxWidth="md" fullWidth>
      <DialogTitle>
        Edit Your Profile
        <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            label="Full Name"
            value={profileForm.fullName || ''}
            onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
            fullWidth
          />
          <TextField
            label="Student ID"
            value={profileForm.studentId || ''}
            disabled
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Faculty</InputLabel>
            <Select
              value={profileForm.faculty || ''}
              onChange={(e) => setProfileForm({ ...profileForm, faculty: e.target.value })}
            >
              {Object.keys(facultyProgrammes).map(faculty => (
                <MenuItem key={faculty} value={faculty}>{faculty}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Add more form fields */}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal}>Cancel</Button>
        <Button variant="contained" onClick={() => console.log('Save profile')}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderComplaintModal = () => (
    <Dialog open={openModal === 'complaint'} onClose={handleCloseModal} maxWidth="md" fullWidth>
      <DialogTitle>
        Submit a Complaint
        <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            label="Student ID"
            value={profile?.studentId || ''}
            disabled
            fullWidth
          />
          <TextField
            label="Complaint Subject"
            value={complaintForm.subject || ''}
            onChange={(e) => setComplaintForm({ ...complaintForm, subject: e.target.value })}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Complaint Type</InputLabel>
            <Select
              value={complaintForm.type || ''}
              onChange={(e) => setComplaintForm({ ...complaintForm, type: e.target.value })}
            >
              <MenuItem value="Academic">Academic</MenuItem>
              <MenuItem value="Administrative">Administrative</MenuItem>
              <MenuItem value="Facilities">Facilities</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Complaint Message"
            multiline
            rows={4}
            value={complaintForm.message || ''}
            onChange={(e) => setComplaintForm({ ...complaintForm, message: e.target.value })}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmitComplaint}>
          Submit Complaint
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderResultIssueModal = () => (
    <Dialog open={openModal === 'result'} onClose={handleCloseModal} maxWidth="md" fullWidth>
      <DialogTitle>
        Report Results Issue
        <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            label="Course Code"
            value={resultForm.courseCode || ''}
            onChange={(e) => setResultForm({ ...resultForm, courseCode: e.target.value })}
            placeholder="e.g., CBT 101"
            fullWidth
          />
          <TextField
            label="Course Title"
            value={resultForm.courseTitle || ''}
            onChange={(e) => setResultForm({ ...resultForm, courseTitle: e.target.value })}
            placeholder="e.g., Introduction to Computing"
            fullWidth
          />
          <TextField
            label="Name of Lecturer"
            value={resultForm.lecturer || ''}
            onChange={(e) => setResultForm({ ...resultForm, lecturer: e.target.value })}
            placeholder="e.g., Dr. Gideon Genius"
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Issue Description</InputLabel>
            <Select
              value={resultForm.description || ''}
              onChange={(e) => setResultForm({ ...resultForm, description: e.target.value })}
            >
              <MenuItem value="Missing Grade">Missing Grade</MenuItem>
              <MenuItem value="Discrepancy in Grade">Discrepancy in Grade</MenuItem>
              <MenuItem value="Incorrect Course Registration">Incorrect Course Registration</MenuItem>
              <MenuItem value="Not on Examination List">Not on Examination List</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Additional Comments (optional)"
            multiline
            rows={3}
            value={resultForm.comment || ''}
            onChange={(e) => setResultForm({ ...resultForm, comment: e.target.value })}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmitResultIssue}>
          Submit Results Issue
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderProgressModal = () => (
    <Dialog open={openModal === 'progress'} onClose={handleCloseModal} maxWidth="md" fullWidth>
      <DialogTitle>
        Progress Details
        <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {progressData && (
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                {progressData.title}
              </Typography>
              <StatusChip 
                label={progressData.status} 
                status={progressData.status}
                size="small"
              />
            </Box>
            
            <Timeline>
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color="success" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="h6" component="span">
                    {progressData.type === 'complaint' ? 'Complaint Submitted' : 'Results Issue Reported'}
                  </Typography>
                  <Typography>
                    {progressData.type === 'complaint' 
                      ? 'Your complaint has been successfully submitted and assigned a reference number.'
                      : 'Your results issue has been submitted and is awaiting review.'
                    }
                  </Typography>
                </TimelineContent>
              </TimelineItem>
              
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color={progressData.status === 'Queued' ? 'primary' : 'success'} />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="h6" component="span">
                    Initial Review
                  </Typography>
                  <Typography>
                    Admin team is reviewing your {progressData.type} and determining the appropriate action.
                  </Typography>
                </TimelineContent>
              </TimelineItem>
              
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color={progressData.status === 'In Progress' ? 'primary' : progressData.status === 'Resolved' ? 'success' : 'grey'} />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="h6" component="span">
                    {progressData.type === 'complaint' ? 'Investigation in Progress' : 'Correction in Progress'}
                  </Typography>
                  <Typography>
                    {progressData.type === 'complaint' 
                      ? 'The relevant department is actively investigating your complaint.'
                      : 'Necessary corrections are being made to your academic records.'
                    }
                  </Typography>
                </TimelineContent>
              </TimelineItem>
              
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color={progressData.status === 'Resolved' ? 'success' : 'grey'} />
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="h6" component="span">
                    {progressData.type === 'complaint' ? 'Resolution Complete' : 'Results Updated'}
                  </Typography>
                  <Typography>
                    {progressData.type === 'complaint' 
                      ? 'Your complaint has been resolved and appropriate actions have been taken.'
                      : 'Your academic records have been updated and the issue is resolved.'
                    }
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
            
            <Alert severity="info">
              <Typography variant="body2">
                <strong>What's Next:</strong> {getNextStepMessage(progressData.status, progressData.type)}
              </Typography>
            </Alert>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );

  const getNextStepMessage = (status: string, type: string) => {
    if (type === 'complaint') {
      switch (status) {
        case 'Queued':
          return 'Your complaint is in the review queue. An admin will begin the initial review within 24-48 hours.';
        case 'In Progress':
          return 'Investigation is underway. You may be contacted for additional information if needed.';
        case 'Resolved':
          return 'Your complaint has been resolved. If you have any follow-up questions, please submit a new complaint.';
        default:
          return 'Please check back later for updates on your complaint status.';
      }
    } else {
      switch (status) {
        case 'Queued':
          return 'Your results issue is being reviewed by the academic office. This typically takes 2-3 business days.';
        case 'In Progress':
          return 'Corrections are being processed. Updated results should be available within 1-2 business days.';
        case 'Resolved':
          return 'Your results have been updated. Please check your student portal to view the corrected information.';
        default:
          return 'Please check back later for updates on your results issue.';
      }
    }
  };

  return (
    <DashboardContainer>
      <MainCard>
        <HeaderBox>
          <LogoContainer>
            <Avatar src="/gctu.png" alt="GCTU Logo" sx={{ width: 40, height: 40 }} />
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Ghana Communication
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Technology University (GCTU)
              </Typography>
            </Box>
          </LogoContainer>
          
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton onClick={() => handleOpenModal('profile')}>
              <Person />
            </IconButton>
            <IconButton>
              <Badge badgeContent={notifications.length} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            <Button 
              variant="contained" 
              color="error" 
              onClick={onLogout}
              startIcon={<Logout />}
            >
              Log out
            </Button>
          </Stack>
        </HeaderBox>

        <CardContent sx={{ p: 3 }}>
          {/* Profile Section */}
          <Card sx={{ mb: 3, p: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ width: 48, height: 48 }}>
                <Person />
              </Avatar>
              <Box>
                <Typography variant="h6">
                  Hello, {profile?.full_name || user?.displayName || 'Student'}
                </Typography>
                <Typography color="text.secondary">
                  {profile?.studentId || user?.email || 'No ID'}
                </Typography>
              </Box>
            </Stack>
          </Card>

          <Divider sx={{ my: 2 }} />

          {/* Academic Information */}
          <Card sx={{ mb: 3, p: 2 }}>
            <Typography variant="h6" gutterBottom>Academic Information</Typography>
            <Stack direction="row" spacing={4} flexWrap="wrap">
              <Box>
                <Typography variant="caption" color="text.secondary">Student ID</Typography>
                <Typography>{profile?.studentId || '—'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Faculty</Typography>
                <Typography>{profile?.faculty || '—'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Group</Typography>
                <Typography>{profile?.department || '—'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Programme</Typography>
                <Typography>{profile?.programme || '—'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Level</Typography>
                <Typography>{profile?.level || '—'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Semester</Typography>
                <Typography>{profile?.semester || '—'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Session</Typography>
                <Typography>{profile?.session || '—'}</Typography>
              </Box>
            </Stack>
          </Card>

          {/* Action Cards */}
          <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 3 }}>
            <ActionCard onClick={() => handleOpenModal('result')}>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <Avatar sx={{ bgcolor: '#eef2ff', color: '#5596ff' }}>
                    <Assignment />
                  </Avatar>
                  <Typography variant="h6" fontSize="1rem">
                    Report Results Issue
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Report missing or incorrect grades
                  </Typography>
                </Stack>
              </CardContent>
            </ActionCard>

            <ActionCard onClick={() => handleOpenModal('complaint')}>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <Avatar sx={{ bgcolor: '#eef2ff', color: '#5596ff' }}>
                    <Report />
                  </Avatar>
                  <Typography variant="h6" fontSize="1rem">
                    Make a Complaint
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Report any non-academic issues
                  </Typography>
                </Stack>
              </CardContent>
            </ActionCard>

            <ActionCard onClick={() => handleOpenModal('trackComplaints')}>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <Avatar sx={{ bgcolor: '#eef2ff', color: '#5596ff' }}>
                    <Track />
                  </Avatar>
                  <Typography variant="h6" fontSize="1rem">
                    Track Complaint
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    See progress on your submitted complaints
                  </Typography>
                </Stack>
              </CardContent>
            </ActionCard>

            <ActionCard onClick={() => handleOpenModal('trackResults')}>
              <CardContent>
                <Stack spacing={1} alignItems="center">
                  <Avatar sx={{ bgcolor: '#eef2ff', color: '#5596ff' }}>
                    <Track />
                  </Avatar>
                  <Typography variant="h6" fontSize="1rem">
                    Track Results Issue
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    See progress on reported results issues
                  </Typography>
                </Stack>
              </CardContent>
            </ActionCard>
          </Stack>
        </CardContent>
      </MainCard>

      {/* Modals */}
      {renderProfileModal()}
      {renderComplaintModal()}
      {renderResultIssueModal()}
      {renderProgressModal()}
      
      {/* Toast Notifications */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3500}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseToast} 
          severity={toastSeverity}
          sx={{ width: '100%' }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </DashboardContainer>
  );
};

export default StudentDashboard;
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
  IconButton,
  Stack,
  Alert,
  Paper
} from '@mui/material';
import {
  Logout as LogoutIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useFirebaseListenerManager } from './FirebaseListenerManager';
import UserManagementTab from './UserManagementTab';
import UserProfileModal from './UserProfileModal';
const db = getDatabase();

// Mock data for preview
const mockUsers = [
  {
    uid: 'user-1',
    name: 'John Doe',
    full_name: 'John Doe',
    studentId: '2425400843',
    email: '2425400843@live.gctu.edu.gh',
    role: 'Student',
    faculty: 'Faculty of Computing & Information Systems',
    timestamp: Date.now() - 86400000
  },
  {
    uid: 'user-2',
    name: 'Jane Smith',
    full_name: 'Jane Smith',
    studentId: '2425400844',
    email: '2425400844@live.gctu.edu.gh',
    role: 'Student',
    faculty: 'Faculty of Computing & Information Systems',
    timestamp: Date.now() - (2 * 24 * 60 * 60 * 1000)
  },
  {
    uid: 'user-3',
    name: 'Bob Johnson',
    full_name: 'Bob Johnson',
    studentId: '2425400845',
    email: '2425400845@live.gctu.edu.gh',
    role: 'Student',
    faculty: 'Faculty of Computing & Information Systems',
    timestamp: Date.now() - 86400000
  },
  {
    uid: 'user-4',
    name: 'Alice Brown',
    full_name: 'Alice Brown',
    studentId: '2425400846',
    email: '2425400846@live.gctu.edu.gh',
    role: 'Student',
    faculty: 'Faculty of Computing & Information Systems',
    timestamp: Date.now() - 3600000
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

const AdminDashboardFixed: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [adminRole] = useState('SuperAdmin');

  // Real data from Firebase
  const [realUsers, setRealUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Use Firebase listener manager
  const listenerManager = useFirebaseListenerManager();

  const currentTheme = createTheme({
    ...theme,
    palette: {
      ...theme.palette,
      mode: darkMode ? 'dark' : 'light',
    },
  });

  // Setup Firebase listeners for real data
  useEffect(() => {
    const setupFirebaseListeners = () => {
      // Listen to users
      const usersRef = ref(db, 'users');
      const usersUnsubscribe = onValue(usersRef, (snapshot) => {
        if (snapshot.exists()) {
          const users = snapshot.val();
          const allUsersArray = Object.entries(users).map(([id, user]: [string, any]) => ({
            uid: user.uid || id,
            studentId: user.studentId || user.studentID || id,
            ...user
          }));
          
          console.log('[ADMIN DEBUG] All users loaded:', allUsersArray.length);
          setRealUsers(allUsersArray);
        } else {
          setRealUsers([]);
        }
        setLoading(false);
      }, (error) => {
        console.error('Users listener error:', error);
        setRealUsers(mockUsers); // Fallback to mock data
        setLoading(false);
      });
      listenerManager.addListener('admin-users', usersUnsubscribe);
    };

    setupFirebaseListeners();

    return () => {
      listenerManager.removeAllListeners();
    };
  }, [listenerManager]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
  };

  const handleCloseUserModal = () => {
    setSelectedUser(null);
  };

  // Use real data if available, otherwise use mock data
  const currentUsers = realUsers.length > 0 ? realUsers : mockUsers;

  // Calculate simple dashboard metrics
  const dashboardMetrics = React.useMemo(() => {
    const totalUsers = currentUsers.length;
    const usersWithEmail = currentUsers.filter(user => Boolean(user.email)).length;
    const usersWithoutEmail = totalUsers - usersWithEmail;

    return {
      totalUsers,
      usersWithEmail,
      usersWithoutEmail
    };
  }, [currentUsers]);

  if (loading) {
    return (
      <ThemeProvider theme={currentTheme}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography>Loading admin dashboard...</Typography>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={currentTheme}>
      <Box sx={{ flexGrow: 1 }}>
        {/* App Bar */}
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <img src="/gctu.png" alt="GCTU Logo" style={{ width: 40, height: 40, marginRight: 12 }} />
              <Box>
                <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  QUEUEUP Admin ({adminRole})
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  GCTU
                </Typography>
              </Box>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton
                onClick={() => setDarkMode(!darkMode)}
                color="inherit"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              <Button
                variant="contained"
                startIcon={<LogoutIcon />}
                onClick={() => console.log('Logout clicked')}
              >
                Log out
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
          {/* Dashboard Overview Cards */}
          <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
            <Card sx={{ minWidth: 200 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Total Users</Typography>
                <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
                  {dashboardMetrics.totalUsers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Registered users
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ minWidth: 200 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Users with Email</Typography>
                <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                  {dashboardMetrics.usersWithEmail}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Have email addresses
                </Typography>
              </CardContent>
            </Card>
            
            <Card sx={{ minWidth: 200 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Users without Email</Typography>
                <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700 }}>
                  {dashboardMetrics.usersWithoutEmail}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Missing email addresses
                </Typography>
              </CardContent>
            </Card>
          </Stack>

          {/* Tabs */}
          <Paper sx={{ width: '100%' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="admin dashboard tabs"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Dashboard Overview" />
              <Tab label="User Management" />
              <Tab label="Complaints" />
              <Tab label="Result Issues" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6" gutterBottom>
                Dashboard Overview
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Welcome to the admin dashboard. Use the tabs above to navigate between different sections.
              </Typography>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <UserManagementTab 
                users={currentUsers} 
                onViewUser={handleViewUser}
              />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>
                Complaints Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Complaints management interface will be displayed here.
              </Typography>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <Typography variant="h6" gutterBottom>
                Result Issues Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Result issues management interface will be displayed here.
              </Typography>
            </TabPanel>
          </Paper>
        </Container>

        {/* User Profile Modal */}
        <UserProfileModal
          user={selectedUser}
          open={!!selectedUser}
          onClose={handleCloseUserModal}
        />
      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboardFixed;
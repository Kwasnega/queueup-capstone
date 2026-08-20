import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { 
  Box, 
  Container, 
  Tabs, 
  Tab, 
  Paper,
  Typography 
} from '@mui/material';
import theme from './src/theme/theme';
import SignupForm from './src/components/auth/SignupForm';
import LoginForm from './src/components/auth/LoginForm';

const createEmotionCache = () => {
  return createCache({
    key: "mui",
    prepend: true,
  });
};

const emotionCache = createEmotionCache();

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
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `auth-tab-${index}`,
    'aria-controls': `auth-tabpanel-${index}`,
  };
}

const App: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <Box 
          sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #e0eafc, #cfdef3)',
            py: 4
          }}
        >
          <Container maxWidth="lg">
            <Paper 
              elevation={3} 
              sx={{ 
                borderRadius: 2,
                overflow: 'hidden',
                mb: 4
              }}
            >
              <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
                <Typography variant="h4" fontWeight="bold">
                  QUEUEUP Authentication System
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
                  Enhanced with Gmail verification & Bell Notifications
                </Typography>
              </Box>
              
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange} 
                  aria-label="auth tabs"
                  centered
                  sx={{
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600
                    }
                  }}
                >
                  <Tab label="Login" {...a11yProps(0)} />
                  <Tab label="Sign Up" {...a11yProps(1)} />
                </Tabs>
              </Box>
            </Paper>

            <TabPanel value={tabValue} index={0}>
              <Box sx={{ 
                p: 4, 
                textAlign: 'center',
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 2
              }}>
                <Typography variant="h5" gutterBottom color="primary">
                  📄 Updated HTML Login Form
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  The login.html file has been updated to authenticate using Gmail addresses 
                  while maintaining backward compatibility with existing accounts.
                </Typography>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'grey.50', 
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'grey.200'
                }}>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    File: login.html
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ✅ Gmail-based authentication<br/>
                    ✅ Verification email sent to Gmail<br/>
                    ✅ Backward compatibility maintained
                  </Typography>
                </Box>
              </Box>
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ 
                p: 4, 
                textAlign: 'center',
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 2
              }}>
                <Typography variant="h5" gutterBottom color="secondary">
                  📝 Updated HTML Signup Form
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  The signup.html file now includes a Gmail address field for verification 
                  while keeping the student email for institutional purposes.
                </Typography>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: 'grey.50', 
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'grey.200'
                }}>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    File: signup.html
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ✅ Added Gmail address field<br/>
                    ✅ Dual email validation<br/>
                    ✅ Student email preserved for records
                  </Typography>
                </Box>
              </Box>
            </TabPanel>

            <Paper 
              elevation={1} 
              sx={{ 
                mt: 4, 
                p: 3, 
                textAlign: 'center',
                bgcolor: 'background.paper'
              }}
            >
              <Typography variant="h6" gutterBottom color="primary">
                🔄 Latest Updates & Features
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Enhanced authentication system with Gmail verification and improved notification experience.
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    📧 Dual Email System
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Student email for records, Gmail for authentication and verification
                  </Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="secondary" gutterBottom>
                    🔔 Smart Notifications
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bell shake animation replaces annoying popup notifications
                  </Typography>
                </Box>
                
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="success.main" gutterBottom>
                    ⚡ Enhanced UX
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Subtle visual cues instead of intrusive toast messages
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 2, color: 'info.contrastText' }}>
                <Typography variant="body2" fontWeight="bold">
                  🎯 Dashboard Enhancement: Notification bell now shakes gently to alert users of new updates instead of showing popup toasts!
                </Typography>
              </Box>
            </Paper>
          </Container>
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;
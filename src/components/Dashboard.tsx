import React, { useState } from 'react';
import {
  Box,
  Container,
  Stack,
  Typography,
  Fade,
  Grow
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Report as ReportIcon,
  Timeline as TimelineIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import DashboardHeader from './DashboardHeader';
import ProfileCard from './ProfileCard';
import ActionCard from './ActionCard';

const DashboardContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 80%, rgba(85, 150, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(139, 135, 255, 0.05) 0%, transparent 50%)
    `,
    pointerEvents: 'none'
  }
}));

const MainContent = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4)
}));

const CardsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: theme.spacing(3),
  marginTop: theme.spacing(4)
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(3),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 60,
    height: 3,
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    borderRadius: 2
  }
}));

// Mock profile data for demonstration
const mockProfile = {
  full_name: 'John Doe',
  studentId: 'GCTU2024001',
  faculty: 'Faculty of Computing & Information Systems (FoCIS)',
  department: 'Group A',
  programme: 'BSc Computer Science',
  level: 'Level 300',
  semester: 'First Semester',
  session: 'Morning'
};

const Dashboard: React.FC = () => {
  const [notificationCount] = useState(3);

  const handleProfileClick = () => {
    console.log('Profile clicked');
  };

  const handleNotificationClick = () => {
    console.log('Notifications clicked');
  };

  const handleLogoutClick = () => {
    console.log('Logout clicked');
  };

  const handleResultsIssue = () => {
    console.log('Report Results Issue clicked');
  };

  const handleComplaint = () => {
    console.log('Make a Complaint clicked');
  };

  const handleTrackComplaints = () => {
    console.log('Track Complaints clicked');
  };

  const handleTrackResults = () => {
    console.log('Track Results Issues clicked');
  };

  return (
    <DashboardContainer>
      <DashboardHeader
        onProfileClick={handleProfileClick}
        onNotificationClick={handleNotificationClick}
        onLogoutClick={handleLogoutClick}
        notificationCount={notificationCount}
      />

      <MainContent maxWidth="xl">
        <Fade in timeout={800}>
          <Box>
            <ProfileCard
              profile={mockProfile}
              userEmail="john.doe@student.gctu.edu.gh"
              displayName="John Doe"
            />
          </Box>
        </Fade>

        <Box mt={6}>
          <SectionTitle>
            Quick Actions
          </SectionTitle>
          
          <CardsGrid>
            <Grow in timeout={600} style={{ transitionDelay: '200ms' }}>
              <div>
                <ActionCard
                  title="Report Results Issue"
                  description="Report missing or incorrect grades and academic records"
                  icon={<AssignmentIcon sx={{ fontSize: 32, color: '#5596ff' }} />}
                  onClick={handleResultsIssue}
                />
              </div>
            </Grow>

            <Grow in timeout={600} style={{ transitionDelay: '400ms' }}>
              <div>
                <ActionCard
                  title="Make a Complaint"
                  description="Submit complaints about non-academic issues and services"
                  icon={<ReportIcon sx={{ fontSize: 32, color: '#6366f1' }} />}
                  onClick={handleComplaint}
                />
              </div>
            </Grow>

            <Grow in timeout={600} style={{ transitionDelay: '600ms' }}>
              <div>
                <ActionCard
                  title="Track Complaints"
                  description="Monitor the progress and status of your submitted complaints"
                  icon={<TimelineIcon sx={{ fontSize: 32, color: '#8b87ff' }} />}
                  onClick={handleTrackComplaints}
                />
              </div>
            </Grow>

            <Grow in timeout={600} style={{ transitionDelay: '800ms' }}>
              <div>
                <ActionCard
                  title="Track Results Issues"
                  description="Check the status and progress of your reported results issues"
                  icon={<AnalyticsIcon sx={{ fontSize: 32, color: '#22c55e' }} />}
                  onClick={handleTrackResults}
                />
              </div>
            </Grow>
          </CardsGrid>
        </Box>
      </MainContent>
    </DashboardContainer>
  );
};

export default Dashboard;
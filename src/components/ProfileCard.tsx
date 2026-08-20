import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  Stack,
  Divider,
  Chip
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  border: `1px solid ${theme.palette.grey[200]}`,
  borderRadius: theme.shape.borderRadius * 1.5,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.12)'
  }
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 64,
  height: 64,
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  fontSize: '2rem'
}));

const WelcomeText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.5rem',
  background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
}));

const StudentIdText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 500,
  fontSize: '1rem'
}));

const InfoGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2)
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5)
}));

const InfoLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
}));

const InfoValue = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 500,
  color: theme.palette.text.primary
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
  color: theme.palette.success.contrastText,
  fontWeight: 600,
  fontSize: '0.75rem'
}));

interface ProfileData {
  full_name?: string;
  studentId?: string;
  faculty?: string;
  department?: string;
  programme?: string;
  level?: string;
  semester?: string;
  session?: string;
}

interface ProfileCardProps {
  profile: ProfileData | null;
  userEmail?: string;
  displayName?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, userEmail, displayName }) => {
  const getName = () => {
    if (profile?.full_name) return profile.full_name;
    if (displayName) return displayName;
    if (userEmail) return userEmail.split('@')[0];
    return 'Student';
  };

  const getStudentId = () => {
    if (profile?.studentId) return profile.studentId;
    if (userEmail) return userEmail;
    return 'No ID';
  };

  return (
    <StyledCard>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <ProfileAvatar>
            <PersonIcon sx={{ fontSize: '2rem' }} />
          </ProfileAvatar>
          <Box flex={1}>
            <WelcomeText>
              Hello, {getName()}
            </WelcomeText>
            <StudentIdText>
              {getStudentId()}
            </StudentIdText>
          </Box>
          <StatusChip label="Active" size="small" />
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Academic Information
        </Typography>

        <InfoGrid>
          <InfoItem>
            <InfoLabel>Student ID</InfoLabel>
            <InfoValue>{profile?.studentId || '—'}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Faculty</InfoLabel>
            <InfoValue>{profile?.faculty || '—'}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Group</InfoLabel>
            <InfoValue>{profile?.department || '—'}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Programme</InfoLabel>
            <InfoValue>{profile?.programme || '—'}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Level</InfoLabel>
            <InfoValue>{profile?.level || '—'}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Semester</InfoLabel>
            <InfoValue>{profile?.semester || '—'}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Session</InfoLabel>
            <InfoValue>{profile?.session || '—'}</InfoValue>
          </InfoItem>
        </InfoGrid>
      </CardContent>
    </StyledCard>
  );
};

export default ProfileCard;
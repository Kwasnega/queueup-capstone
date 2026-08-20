import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Button,
  Badge,
  Avatar,
  Typography,
  Stack
} from '@mui/material';
import {
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  borderBottom: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary
}));

const LogoContainer = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  gap: theme.spacing(1.5)
}));

const LogoImage = styled('img')(({ theme }) => ({
  height: 48,
  width: 48,
  borderRadius: theme.shape.borderRadius,
  objectFit: 'cover'
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.25rem',
  background: 'linear-gradient(135deg, #5596ff 0%, #6366f1 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  lineHeight: 1.2
}));

const LogoSubtext = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  fontWeight: 500
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  background: theme.palette.grey[50],
  border: `1px solid ${theme.palette.grey[200]}`,
  borderRadius: theme.shape.borderRadius,
  width: 48,
  height: 48,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4]
  }
}));

const ProfileButton = styled(IconButton)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  width: 56,
  height: 56,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4]
  }
}));

const LogoutButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, #dc2626 100%)`,
  color: theme.palette.error.contrastText,
  fontWeight: 600,
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.error.dark} 0%, #b91c1c 100%)`,
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4]
  }
}));

const NotificationBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, #dc2626 100%)`,
    color: theme.palette.error.contrastText,
    fontWeight: 600,
    fontSize: '0.75rem'
  }
}));

interface DashboardHeaderProps {
  onProfileClick: () => void;
  onNotificationClick: () => void;
  onLogoutClick: () => void;
  notificationCount: number;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onProfileClick,
  onNotificationClick,
  onLogoutClick,
  notificationCount
}) => {
  return (
    <StyledAppBar position="static" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        <LogoContainer direction="row">
          <LogoImage
            src="https://images.unsplash.com/photo-1633544325196-bcf8bf81ead0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwbG9nbyUyMHRlY2hub2xvZ3klMjBlZHVjYXRpb258ZW58MHwyfHxibHVlfDE3NTg1NTkzMDB8MA&ixlib=rb-4.1.0&q=85"
            alt="GCTU Logo - Javier Esteban on Unsplash"
            width={48}
            height={48}
          />
          <Box>
            <LogoText>
              Ghana Communication
            </LogoText>
            <LogoSubtext>
              Technology University (GCTU)
            </LogoSubtext>
          </Box>
        </LogoContainer>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <ProfileButton onClick={onProfileClick} title="Edit Profile">
            <PersonIcon sx={{ fontSize: 28 }} />
          </ProfileButton>

          <NotificationBadge
            badgeContent={notificationCount}
            invisible={notificationCount === 0}
          >
            <StyledIconButton onClick={onNotificationClick} title="Notifications">
              <NotificationsIcon />
            </StyledIconButton>
          </NotificationBadge>

          <LogoutButton
            onClick={onLogoutClick}
            startIcon={<LogoutIcon />}
            title="Log out"
          >
            Log out
          </LogoutButton>
        </Stack>
      </Toolbar>
    </StyledAppBar>
  );
};

export default DashboardHeader;
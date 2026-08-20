import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const AuthContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  minHeight: '100vh',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column'
  }
}));

const ImageSection = styled(Box)(({ theme }) => ({
  flex: 1,
  backgroundImage: 'url("https://images.unsplash.com/photo-1606733803396-1d028f0e6f43?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHxsaWJyYXJ5JTIwYm9va3MlMjB1bml2ZXJzaXR5JTIwYWNhZGVtaWMlMjBpbnRlcmlvcnxlbnwwfDB8fHwxNzU4NTc4NzQyfDA&ixlib=rb-4.1.0&q=85")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.25)',
    zIndex: 1
  },
  [theme.breakpoints.down('md')]: {
    height: 250,
    order: 1
  }
}));

const FormSection = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(5),
  backgroundColor: theme.palette.background.paper,
  position: 'relative',
  zIndex: 2,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(4, 2.5),
    order: 2
  }
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  textAlign: 'center'
}));

const Logo = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: '50%',
  boxShadow: theme.shadows[3],
  objectFit: 'cover'
}));

const FormCard = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  padding: theme.spacing(6),
  borderRadius: theme.shape.borderRadius * 1.5,
  boxShadow: theme.shadows[4],
  textAlign: 'center',
  width: '100%',
  maxWidth: 450,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[5]
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: '90%',
    padding: theme.spacing(4)
  }
}));

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <AuthContainer>
      <ImageSection />
      <FormSection>
        <LogoContainer>
          <Logo 
            src="https://images.unsplash.com/photo-1609831499898-a0100d320fbb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwbG9nbyUyMGVkdWNhdGlvbiUyMGFjYWRlbWljfGVufDB8Mnx8fDE3NTg1Nzg3NDF8MA&ixlib=rb-4.1.0&q=85"
            alt="GCTU Logo - Marin huang on Unsplash" 
            width="120"
            height="120"
          />
        </LogoContainer>
        <FormCard>
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 2, 
              fontWeight: 600, 
              color: 'text.primary' 
            }}
          >
            {title}
          </Typography>
          {children}
        </FormCard>
      </FormSection>
    </AuthContainer>
  );
};

export default AuthLayout;
import React from 'react';
import { Chip } from '@mui/material';
import { CheckCircle, Warning } from '@mui/icons-material';

interface UserVerificationStatusProps {
  user: any;
  size?: 'small' | 'medium';
}

const UserVerificationStatus: React.FC<UserVerificationStatusProps> = ({ user, size = 'small' }) => {
  // Simple verification check - just check if user has email
  const hasEmail = Boolean(user.email);
  
  return (
    <Chip
      icon={hasEmail ? <CheckCircle sx={{ fontSize: 16 }} /> : <Warning sx={{ fontSize: 16 }} />}
      label={hasEmail ? 'Has Email' : 'No Email'}
      color={hasEmail ? 'success' : 'warning'}
      size={size}
      variant="filled"
      sx={{ fontSize: '11px' }}
    />
  );
};

export default UserVerificationStatus;
import React from 'react';
import { Chip } from '@mui/material';

interface StatusBadgeProps {
  status: string;
  size?: 'small' | 'medium';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'small' }) => {
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
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in_progress':
        return 'In Progress';
      case 'queued':
        return 'Queued';
      case 'pending':
        return 'Pending';
      case 'resolved':
        return 'Resolved';
      case 'deleted':
        return 'Deleted';
      case 'inactive':
        return 'Inactive';
      default:
        return status;
    }
  };

  return (
    <Chip
      label={getStatusLabel(status)}
      color={getStatusColor(status) as any}
      size={size}
      variant="filled"
    />
  );
};

export default StatusBadge;
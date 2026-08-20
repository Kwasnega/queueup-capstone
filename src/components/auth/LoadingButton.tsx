import React from 'react';
import { Button, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  fontSize: '1.125rem',
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  boxShadow: `0 4px 10px ${theme.palette.primary.main}33`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 6px 16px ${theme.palette.primary.main}44`
  },
  '&:disabled': {
    cursor: 'not-allowed',
    opacity: 0.8,
    pointerEvents: 'none',
    transform: 'none'
  }
}));

const LoadingContent = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8
});

interface LoadingButtonProps {
  loading: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  disabled?: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  children,
  onClick,
  type = 'button',
  variant = 'contained',
  color = 'primary',
  disabled = false
}) => {
  return (
    <StyledButton
      type={type}
      variant={variant}
      color={color}
      disabled={loading || disabled}
      onClick={onClick}
    >
      {loading ? (
        <LoadingContent>
          <CircularProgress 
            size={18} 
            sx={{ 
              color: variant === 'contained' ? 'white' : 'primary.main' 
            }} 
          />
          Loading...
        </LoadingContent>
      ) : (
        children
      )}
    </StyledButton>
  );
};

export default LoadingButton;
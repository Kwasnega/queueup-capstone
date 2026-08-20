import React, { useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  Link as MuiLink,
  Stack
} from '@mui/material';
import AuthLayout from './AuthLayout';
import FormInput from './FormInput';
import LoadingButton from './LoadingButton';

interface LoginFormData {
  studentId: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    studentId: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResendButton, setShowResendButton] = useState(false);
  const [resendEmail, setResendEmail] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowResendButton(false);
    
    if (!formData.studentId.trim()) {
      setError('Student ID is required.');
      return;
    }
    
    if (!formData.password) {
      setError('Password is required.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate Firebase login process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate email not verified scenario
      const isEmailVerified = Math.random() > 0.5; // 50% chance for demo
      
      if (!isEmailVerified) {
        setError('Please verify your email address before logging in. You can resend the link below.');
        setShowResendButton(true);
        setResendEmail('user@gmail.com'); // This would come from database
        return;
      }
      
      // Successful login - redirect to dashboard
      console.log('Login successful, redirecting to dashboard...');
      
    } catch (err: any) {
      let errorMessage = 'An unknown error occurred. Please try again.';
      
      switch (err.code) {
        case 'auth/email-not-verified':
          errorMessage = 'Please verify your email address before logging in. You can resend the link below.';
          setShowResendButton(true);
          setResendEmail(err.customEmail);
          break;
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMessage = 'Incorrect password.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'User account not found. Please check your credentials.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        default:
          errorMessage = err.message;
          break;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      // Simulate sending verification email
      await new Promise(resolve => setTimeout(resolve, 1000));
      setError('Verification email sent! Please check your Gmail inbox.');
    } catch (error) {
      setError('Failed to send email. Please try again later.');
    }
  };

  return (
    <AuthLayout title="Student Login">
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        {error && (
          <Alert severity={showResendButton ? "warning" : "error"} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={2}>
          <FormInput
            label="Student ID"
            name="studentId"
            placeholder="Enter your Student ID"
            value={formData.studentId}
            onChange={handleInputChange}
            required
          />

          <FormInput
            label="Password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            required
            showPasswordToggle
          />

          <Box sx={{ mt: 3 }}>
            <LoadingButton
              type="submit"
              loading={loading}
            >
              Login
            </LoadingButton>
          </Box>

          {showResendButton && (
            <Box sx={{ mt: 2 }}>
              <LoadingButton
                onClick={handleResendVerification}
                variant="outlined"
                color="success"
              >
                Resend Verification Email
              </LoadingButton>
            </Box>
          )}
        </Stack>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <MuiLink 
              href="/password-reset" 
              sx={{ 
                color: 'primary.main', 
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Forgot Password?
            </MuiLink>
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <MuiLink 
              href="/signup" 
              sx={{ 
                color: 'primary.main', 
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Sign Up
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default LoginForm;
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

interface SignupFormData {
  studentId: string;
  studentEmail: string;
  gmailAddress: string;
  password: string;
  confirmPassword: string;
}

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    studentId: '',
    studentEmail: '',
    gmailAddress: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.studentId.trim()) {
      return 'Student ID is required.';
    }
    
    if (!formData.studentEmail.trim()) {
      return 'Student email is required.';
    }
    
    if (!formData.studentEmail.endsWith('@live.gctu.edu.gh')) {
      return 'Please use your indexNumber@live.gctu.edu.gh email address.';
    }
    
    if (!formData.gmailAddress.trim()) {
      return 'Gmail address is required for verification.';
    }
    
    if (!formData.gmailAddress.endsWith('@gmail.com')) {
      return 'Please enter a valid Gmail address.';
    }
    
    if (!formData.password) {
      return 'Password is required.';
    }
    
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match.';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate Firebase signup process
      // In real implementation, this would create user with gmailAddress for auth
      // and store studentEmail in database for institutional purposes
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMessage('Account created! Please check your Gmail to verify your account.');
      setFormData({
        studentId: '',
        studentEmail: '',
        gmailAddress: '',
        password: '',
        confirmPassword: ''
      });
      
    } catch (err: any) {
      let errorMessage = 'An error occurred during signup. Please try again.';
      
      // Handle specific Firebase errors
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This Gmail address is already in use by another account.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. It must be at least 6 characters long.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'The Gmail address is not valid.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create an Account">
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
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
            label="Student Email"
            name="studentEmail"
            type="email"
            placeholder="Enter your student email"
            value={formData.studentEmail}
            onChange={handleInputChange}
            required
            helperText="* Must use your indexNumber@live.gctu.edu.gh email"
          />

          <FormInput
            label="Gmail Address"
            name="gmailAddress"
            type="email"
            placeholder="Enter your Gmail address"
            value={formData.gmailAddress}
            onChange={handleInputChange}
            required
            showEmailIcon
            helperText="* Verification link will be sent to this Gmail address"
          />

          <FormInput
            label="Password"
            name="password"
            placeholder="Enter a password"
            value={formData.password}
            onChange={handleInputChange}
            required
            showPasswordToggle
          />

          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            showPasswordToggle
          />

          <Box sx={{ mt: 3 }}>
            <LoadingButton
              type="submit"
              loading={loading}
            >
              Sign Up
            </LoadingButton>
          </Box>
        </Stack>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <MuiLink 
              href="/login" 
              sx={{ 
                color: 'primary.main', 
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Login
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default SignupForm;
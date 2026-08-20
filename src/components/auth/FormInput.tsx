import React, { useState } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  MailOutline
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
    transition: 'all 0.3s ease',
    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.light
      }
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: 2
      }
    }
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
    color: theme.palette.text.secondary,
    '&.Mui-focused': {
      color: theme.palette.primary.main
    }
  }
}));

const HelperText = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
  marginLeft: theme.spacing(1.5),
  lineHeight: 1.4
}));

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
  helperText?: string;
  showPasswordToggle?: boolean;
  showEmailIcon?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  error,
  helperText,
  showPasswordToggle = false,
  showEmailIcon = false
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  return (
    <Box sx={{ textAlign: 'left', width: '100%' }}>
      <StyledTextField
        fullWidth
        label={label}
        name={name}
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        error={!!error}
        helperText={error}
        InputProps={{
          startAdornment: showEmailIcon ? (
            <InputAdornment position="start">
              <MailOutline sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ) : undefined,
          endAdornment: showPasswordToggle ? (
            <InputAdornment position="end">
              <IconButton
                onClick={handleTogglePassword}
                edge="end"
                sx={{ color: 'text.secondary' }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : undefined
        }}
      />
      {helperText && !error && (
        <HelperText>
          {helperText}
        </HelperText>
      )}
    </Box>
  );
};

export default FormInput;
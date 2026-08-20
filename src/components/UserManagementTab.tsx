import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  Chip
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import UserVerificationStatus from './UserVerificationStatus';

interface User {
  uid: string;
  name?: string;
  full_name?: string;
  studentId?: string;
  studentID?: string;
  email?: string;
  role?: string;
  timestamp?: number;
  faculty?: string;
  department?: string;
  programme?: string;
  program?: string;
  course?: string;
  group?: string;
  student_group?: string;
  level?: string;
  academic_year?: string;
  semester?: string;
  current_semester?: string;
  session?: string;
  time_session?: string;
}

interface UserManagementTabProps {
  users: User[];
  onViewUser: (user: User) => void;
}

const UserManagementTab: React.FC<UserManagementTabProps> = ({ users, onViewUser }) => {
  const [userSearch, setUserSearch] = useState('');

  // Filter users based on search only
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const name = user.name || user.full_name || '';
      const sid = user.studentId || user.studentID || '';
      const matchesSearch = name.toLowerCase().includes(userSearch.toLowerCase()) || 
                           sid.toLowerCase().includes(userSearch.toLowerCase());
      
      return matchesSearch;
    });
  }, [users, userSearch]);

  // Simple statistics
  const stats = useMemo(() => {
    const total = filteredUsers.length;
    const withEmail = filteredUsers.filter(u => Boolean(u.email)).length;
    const withoutEmail = total - withEmail;

    return { total, withEmail, withoutEmail };
  }, [filteredUsers]);

  const formatJoinDate = (user: User) => {
    if (user.timestamp) {
      return new Date(user.timestamp).toLocaleDateString();
    }
    return 'N/A';
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          {/* Header with search and filters */}
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} flexWrap="wrap">
              <Box>
                <Typography variant="h6" gutterBottom>
                  All Users
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ({stats.total} total, {stats.withEmail} with email, {stats.withoutEmail} without email)
                </Typography>
              </Box>
              
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  size="small"
                  placeholder="Search by name or ID..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  sx={{ minWidth: 250 }}
                />
              </Stack>
            </Stack>
          </Box>

          {/* Users table */}
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Join Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No users found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.uid} hover>
                      <TableCell>
                        <Typography variant="body2">
                          {user.name || user.full_name || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {user.studentId || user.studentID || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {user.role || 'Student'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatJoinDate(user)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <UserVerificationStatus user={user} />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          onClick={() => onViewUser(user)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default UserManagementTab;
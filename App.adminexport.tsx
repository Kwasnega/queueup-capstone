import React from 'react';
import { CssBaseline } from '@mui/material';
import AdminDashboard from './src/components/AdminDashboard';

const App: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <AdminDashboard />
    </>
  );
};

export default App;
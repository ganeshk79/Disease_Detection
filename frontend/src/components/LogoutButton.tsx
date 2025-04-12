import React from 'react';
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import LogoutIcon from '@mui/icons-material/Logout';

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogout}
        startIcon={<LogoutIcon />}
        sx={{
          borderRadius: '20px',
          textTransform: 'none',
          padding: '8px 16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default LogoutButton; 
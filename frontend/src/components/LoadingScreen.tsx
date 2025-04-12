import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import AppIcon from '../assets/app_icon.jpg';
import { keyframes } from '@mui/system';

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const LoadingScreen: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
        zIndex: 9999,
      }}
    >
      <Box
        component="img"
        src={AppIcon}
        alt="App Icon"
        sx={{
          width: 120,
          height: 120,
          mb: 3,
          animation: `${pulse} 2s ease-in-out infinite`,
        }}
      />
      <CircularProgress size={40} sx={{ color: '#2196F3' }} />
    </Box>
  );
};

export default LoadingScreen; 
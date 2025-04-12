import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  //Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import HandImage from '../assets/hand_check.png';
import LogoutButton from '../components/LogoutButton';

type Severity = 'error' | 'warning' | 'info' | 'success';

interface DiseaseInfo {
  title: string;
  description: string;
  severity: Severity;
}

interface DiseaseInfoMap {
  [key: string]: DiseaseInfo;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:10000';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const ResultImage = styled('img')(({ theme }) => ({
  width: '100%',
  maxHeight: '300px',
  objectFit: 'contain',
  borderRadius: '15px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out',
  marginBottom: theme.spacing(3),
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const BackButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  borderRadius: '50px',
  textTransform: 'none',
  fontSize: '1rem',
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
  },
}));

const PredictionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '15px',
  background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const InfoImage = styled('img')(({ theme }) => ({
  width: '100%',
  maxHeight: '200px',
  objectFit: 'contain',
  borderRadius: '15px',
  marginTop: theme.spacing(4),
  opacity: 0.9,
  transition: 'opacity 0.3s ease-in-out',
  '&:hover': {
    opacity: 1,
  },
}));

interface ResultState {
  image: string;
  prediction: {
    predicted_class: string;
    confidence?: number;
  };
}

const diseaseInfo: DiseaseInfoMap = {
  'melanoma': {
    title: 'Melanoma',
    description: 'A serious form of skin cancer that begins in cells known as melanocytes. Early detection is crucial for successful treatment.',
    severity: 'error'
  },
  'basal cell carcinoma': {
    title: 'Basal Cell Carcinoma',
    description: 'The most common type of skin cancer. It rarely spreads to other parts of the body but should be treated promptly.',
    severity: 'error'
  },
  'actinic keratosis': {
    title: 'Actinic Keratosis',
    description: 'A pre-cancerous growth that may develop into squamous cell carcinoma if left untreated.',
    severity: 'warning'
  },
  'pigmented benign keratosis': {
    title: 'Pigmented Benign Keratosis',
    description: 'A harmless growth that appears as a waxy, scaly, slightly elevated growth on the skin.',
    severity: 'info'
  },
  'dermatofibroma': {
    title: 'Dermatofibroma',
    description: 'A common, harmless growth that often appears as a hard, raised bump on the skin.',
    severity: 'success'
  },
  'nevus': {
    title: 'Nevus (Mole)',
    description: 'A common, usually harmless growth on the skin that appears as a small, dark spot.',
    severity: 'success'
  },
  'vascular lesion': {
    title: 'Vascular Lesion',
    description: 'An abnormality of blood vessels that may appear as a red or purple mark on the skin.',
    severity: 'info'
  }
};

const Result: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openDialog, setOpenDialog] = useState(false);
  
  const state = location.state as ResultState | null;
  
  React.useEffect(() => {
    if (!state) {
      navigate('/home');
    }
  }, [state, navigate]);

  if (!state) {
    return null;
  }

  const { image, prediction } = state;

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const formatPrediction = (prediction: string): string => {
    return prediction
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getSeverityColor = (prediction: string): Severity => {
    const severityMap: { [key: string]: Severity } = {
      'melanoma': 'error',
      'basal cell carcinoma': 'error',
      'actinic keratosis': 'warning',
      'pigmented benign keratosis': 'info',
      'dermatofibroma': 'success',
      'nevus': 'success',
      'vascular lesion': 'info',
    };
    return severityMap[prediction.toLowerCase()] || 'info';
  };

  const currentDisease = diseaseInfo[prediction.predicted_class.toLowerCase()];

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          marginTop: { xs: 4, sm: 8 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        <LogoutButton />
        <Fade in timeout={1000}>
          <StyledPaper elevation={3}>
            <BackButton
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/home')}
              sx={{ mb: 3 }}
            >
              Back to Home
            </BackButton>

            <Typography
              variant={isMobile ? 'h4' : 'h3'}
              component="h1"
              gutterBottom
              align="center"
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 4,
              }}
            >
              Analysis Results
            </Typography>

            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                mb: 4,
              }}
            >
              <InfoImage
                src={HandImage}
                alt="Skin examination illustration"
              />
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Zoom in timeout={500}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: 'text.secondary' }}
                    >
                      Uploaded Image
                    </Typography>
                    <ResultImage
                      src={image}
                      alt="Analyzed"
                    />
                  </Box>
                </Zoom>
              </Grid>

              <Grid item xs={12} md={6}>
                <Zoom in timeout={700}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: 'text.secondary' }}
                    >
                      Prediction
                    </Typography>
                    <PredictionCard elevation={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={formatPrediction(prediction.predicted_class)}
                          color={getSeverityColor(prediction.predicted_class)}
                          sx={{
                            fontSize: '1.1rem',
                            padding: '8px 16px',
                          }}
                        />
                        <IconButton
                          onClick={handleOpenDialog}
                          sx={{ color: 'primary.main' }}
                        >
                          <InfoIcon />
                        </IconButton>
                      </Box>
                      {prediction.confidence && (
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{ mt: 2 }}
                        >
                          Confidence: {(prediction.confidence * 100).toFixed(2)}%
                        </Typography>
                      )}
                    </PredictionCard>
                  </Box>
                </Zoom>
              </Grid>
            </Grid>
          </StyledPaper>
        </Fade>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {currentDisease?.title}
              <IconButton onClick={handleCloseDialog}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" paragraph>
              {currentDisease?.description}
            </Typography>
            <Chip
              label={`Severity: ${currentDisease?.severity.toUpperCase()}`}
              color={currentDisease?.severity}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Result; 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
//import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import InfoIcon from '@mui/icons-material/Info';
import { styled } from '@mui/material/styles';
import DoctorImage from '../assets/doctor_examining.png';
import LogoutButton from '../components/LogoutButton';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const UploadButton = styled(Button)<{ component?: React.ElementType }>(({ theme }) => ({
  padding: theme.spacing(2, 4),
  borderRadius: '50px',
  textTransform: 'none',
  fontSize: '1.1rem',
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
  },
}));

const AnalyzeButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2, 4),
  borderRadius: '50px',
  textTransform: 'none',
  fontSize: '1.1rem',
  background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
  boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #388E3C 30%, #66BB6A 90%)',
  },
  '&.Mui-disabled': {
    background: '#e0e0e0',
  },
}));

const PreviewImage = styled('img')(({ theme }) => ({
  maxWidth: '100%',
  maxHeight: '300px',
  borderRadius: '15px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const WelcomeImage = styled('img')(({ theme }) => ({
  maxWidth: '300px',
  height: 'auto',
  borderRadius: '20px',
  marginBottom: theme.spacing(4),
  marginRight: theme.spacing(4),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
    marginRight: 0,
  },
}));

interface ApiResponse {
  predicted_class: string;
  error?: string;
}

const diseaseInfo = {
  'actinic keratosis': {
    description: 'A pre-cancerous growth that may develop into squamous cell carcinoma if left untreated.',
    severity: 'warning',
    risk: '15-20%',
    riskLevel: 'Moderate',
    treatment: 'Cryotherapy, topical medications, or surgical removal'
  },
  'basal cell carcinoma': {
    description: 'The most common type of skin cancer. It rarely spreads to other parts of the body but should be treated promptly.',
    severity: 'error',
    risk: 'High',
    riskLevel: 'High',
    treatment: 'Surgical removal, radiation therapy, or topical medications'
  },
  'pigmented benign keratosis': {
    description: 'A harmless growth that appears as a waxy, scaly, slightly elevated growth on the skin.',
    severity: 'info',
    risk: '0%',
    riskLevel: 'None',
    treatment: 'Usually no treatment needed, can be removed for cosmetic reasons'
  },
  'dermatofibroma': {
    description: 'A common, harmless growth that often appears as a hard, raised bump on the skin.',
    severity: 'success',
    risk: '0%',
    riskLevel: 'None',
    treatment: 'No treatment needed, can be removed if bothersome'
  },
  'melanoma': {
    description: 'A serious form of skin cancer that begins in cells known as melanocytes. Early detection is crucial for successful treatment.',
    severity: 'error',
    risk: 'Very High',
    riskLevel: 'Critical',
    treatment: 'Surgical removal, immunotherapy, targeted therapy, or chemotherapy'
  },
  'melanocytic nevi': {
    description: 'Common moles that are usually harmless but should be monitored for changes.',
    severity: 'info',
    risk: 'Low',
    riskLevel: 'Low',
    treatment: 'Regular monitoring, removal if suspicious changes occur'
  },
  'vascular lesion': {
    description: 'An abnormality of blood vessels that may appear as a red or purple mark on the skin.',
    severity: 'info',
    risk: 'Low',
    riskLevel: 'Low',
    treatment: 'Laser therapy, surgical removal, or observation'
  }
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:10000';

const Home: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setError(null);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.onerror = () => {
          setError('Error reading file');
        };
        reader.readAsDataURL(file);
      } else {
        setError('Please upload an image file');
        setSelectedFile(null);
        setPreviewUrl(null);
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const result: ApiResponse = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      navigate('/result', { 
        state: { 
          image: previewUrl, 
          prediction: { 
            predicted_class: result.predicted_class 
          } 
        } 
      });
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInfoDialogOpen = () => {
    setInfoDialogOpen(true);
  };

  const handleInfoDialogClose = () => {
    setInfoDialogOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(3),
      }}
    >
      <Fade in={true} timeout={1000}>
        <Container maxWidth="md">
          <Box
            sx={{
              marginTop: { xs: 4, sm: 8 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minHeight: '100vh',
            }}
          >
            <StyledPaper elevation={3}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  mb: 2,
                  position: 'relative',
                }}
              >
                <Typography
                  variant={isMobile ? 'h5' : 'h3'}
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    flex: 1,
                    textAlign: 'left',
                  }}
                >
                  Skin Disease Detection
                </Typography>
                <Box
                  sx={{
                    position: 'absolute',
                    right:isMobile ? '-16%' : '0',
                    top:isMobile ? '23%' : '0%',
                    transform: 'translateY(-50%)',
                    fontSize: 10,
                  }}
                >
                  <LogoutButton />
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mb: 4,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 4,
                    maxWidth: '800px',
                  }}
                >
                  <Typography
                    variant={isMobile ? 'body1' : 'h6'}
                    color="text.secondary"
                    align="center"
                    paragraph
                    sx={{ mb: 0 }}
                  >
                    Upload an image of the skin area you want to analyze. Our AI-powered system will help identify potential skin conditions.
                  </Typography>
                  <IconButton
                    onClick={handleInfoDialogOpen}
                    sx={{
                      color: theme.palette.primary.main,
                      backgroundColor: 'rgba(33, 150, 243, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(33, 150, 243, 0.2)',
                        transform: 'scale(1.1)',
                        transition: 'transform 0.2s ease-in-out',
                      },
                    }}
                  >
                    <InfoIcon fontSize="large" />
                  </IconButton>
                </Box>

                <WelcomeImage
                  src={DoctorImage}
                  alt="Doctor examining patient"
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    width: '100%',
                  }}
                >
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="raised-button-file">
                    <UploadButton
                      variant="contained"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload Image
                    </UploadButton>
                  </label>

                  {error && (
                    <Typography color="error" align="center">
                      {error}
                    </Typography>
                  )}

                  {previewUrl && (
                    <Zoom in timeout={500}>
                      <Box sx={{ mt: 2, mb: 2 }}>
                        <PreviewImage
                          src={previewUrl}
                          alt="Preview"
                        />
                      </Box>
                    </Zoom>
                  )}

                  <AnalyzeButton
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!selectedFile || isLoading}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Analyze Image'
                    )}
                  </AnalyzeButton>
                </Box>
              </Box>
            </StyledPaper>
          </Box>

          <Dialog
            open={infoDialogOpen}
            onClose={handleInfoDialogClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: theme.spacing(2),
                background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
              },
            }}
          >
            <DialogTitle sx={{ 
              textAlign: 'center',
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              fontSize: '1.5rem',
            }}>
              Skin Diseases Information
            </DialogTitle>
            <DialogContent>
              <List>
                {Object.entries(diseaseInfo).map(([disease, info], index) => (
                  <React.Fragment key={disease}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box>
                            <Typography
                              variant="h6"
                              sx={{
                                color: theme.palette.primary.main,
                                fontWeight: 'bold',
                                mb: 1,
                              }}
                            >
                              {disease.charAt(0).toUpperCase() + disease.slice(1)}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: info.severity === 'error' 
                                    ? theme.palette.error.main 
                                    : info.severity === 'warning' 
                                      ? theme.palette.warning.main 
                                      : info.severity === 'success' 
                                        ? theme.palette.success.main 
                                        : theme.palette.info.main,
                                  fontWeight: 'bold',
                                }}
                              >
                                Risk Level: {info.riskLevel}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: theme.palette.text.secondary,
                                }}
                              >
                                • Risk: {info.risk}
                              </Typography>
                            </Box>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{
                                color: theme.palette.text.secondary,
                                mb: 1,
                              }}
                            >
                              {info.description}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: theme.palette.primary.main,
                                fontWeight: 'medium',
                              }}
                            >
                              Treatment: {info.treatment}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < Object.keys(diseaseInfo).length - 1 && (
                      <Divider sx={{ my: 1 }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleInfoDialogClose}
                sx={{
                  borderRadius: theme.spacing(2),
                  textTransform: 'none',
                  px: 3,
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Fade>
    </Box>
  );
};

export default Home; 
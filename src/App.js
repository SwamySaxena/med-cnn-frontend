import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Container, Typography, CircularProgress, Alert, Input, Card, CardContent } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      //const response = await axios.post('https://medeye-backend.onrender.com/predict', formData, {  // Update with your backend URL
      const response = await axios.post('https://med-cnn-backend.onrender.com/predict', formData, { 
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(`Diagnosis Result: Severity Level ${response.data.severity}`);
    } catch (error) {
      console.error('Error during prediction:', error);
      setResult('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" className="App">
      <Card elevation={3} className="card">
        <CardContent>
          <Typography variant="h4" gutterBottom>
            MedEye: Diabetic Retinopathy Detection
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Upload a retinal image to get a diagnosis for diabetic retinopathy severity.
          </Typography>
          <Box component="form" onSubmit={handleSubmit} mt={3} mb={2}>
            <Input
              type="file"
              onChange={handleFileChange}
              disableUnderline
              inputProps={{ accept: 'image/*' }}
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              endIcon={<CloudUploadIcon />}
              disabled={loading}
              sx={{ mt: 2, mb: 2 }}
              fullWidth
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Upload and Diagnose'}
            </Button>
          </Box>
          {result && (
            <Alert severity={result.includes('Severity') ? 'success' : 'error'}>
              {result}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import RecommendationSection from '../components/RecommendationSection';
import { recommendationAPI } from '../services/api';

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`recommendation-tabpanel-${index}`}
      aria-labelledby={`recommendation-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const Recommendations = () => {
  const [tabValue, setTabValue] = useState(0);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        setLoading(true);
        const response = await recommendationAPI.getTrending();
        setTrendingProducts(response.data.products || []);
      } catch (err) {
        setError('Failed to load trending products');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" height={400}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2 }}>
        Product Recommendations
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Tabs value={tabValue} onChange={handleTabChange} aria-label="recommendation tabs">
        <Tab label="Personalized" />
        <Tab label="Trending" />
        <Tab label="Based on History" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <RecommendationSection 
          title="Personalized For You"
          userId="current-user-id" // This should come from auth context
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <RecommendationSection 
          title="Trending Products"
          products={trendingProducts}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h5" gutterBottom>
          Based on Your Purchase History
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Recommendations based on your previous orders and browsing behavior.
        </Typography>
        {/* This would be populated with history-based recommendations */}
      </TabPanel>
    </Container>
  );
};

export default Recommendations;
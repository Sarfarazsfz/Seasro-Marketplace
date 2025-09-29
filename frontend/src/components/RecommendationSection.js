import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Rating,
  Stack,
  alpha,
} from '@mui/material';
import {
  AddShoppingCart,
  Favorite,
  FlashOn,
  TrendingUp,
  Group,
  LocalFireDepartment,
} from '@mui/icons-material';
import { recommendationService } from '../services/api';

const RecommendationCard = ({ recommendation, onAddToCart }) => {
  const { product, score, reason, type } = recommendation;
  const [imageError, setImageError] = useState(false);

  const getTypeIcon = (recType) => {
    const icons = {
      content_based: <FlashOn sx={{ fontSize: 16 }} />,
      collaborative: <Group sx={{ fontSize: 16 }} />,
      popularity: <TrendingUp sx={{ fontSize: 16 }} />,
      association: <LocalFireDepartment sx={{ fontSize: 16 }} />,
    };
    return icons[type] || <FlashOn sx={{ fontSize: 16 }} />;
  };

  const getTypeColor = (recType) => {
    const colors = {
      content_based: 'success',
      collaborative: 'primary',
      popularity: 'warning',
      association: 'error',
    };
    return colors[type] || 'default';
  };

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Recommendation Badge */}
      <Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}>
        <Tooltip title={reason}>
          <Chip 
            icon={getTypeIcon(type)}
            label={`${(score * 100).toFixed(0)}% Match`}
            size="small"
            color={getTypeColor(type)}
            variant="filled"
            sx={{ 
              fontWeight: 600,
              backdropFilter: 'blur(10px)',
              bgcolor: alpha('#000', 0.7),
              color: 'white'
            }}
          />
        </Tooltip>
      </Box>

      {/* Wishlist Button */}
      <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
        <IconButton 
          size="small" 
          sx={{ 
            bgcolor: 'rgba(255,255,255,0.9)',
            '&:hover': { bgcolor: 'white' }
          }}
        >
          <Favorite sx={{ fontSize: 16, color: 'text.secondary' }} />
        </IconButton>
      </Box>

      <CardMedia
        component="img"
        height="200"
        image={imageError ? '/api/placeholder/300/200' : (product.images?.[0]?.url || '/api/placeholder/300/200')}
        alt={product.name}
        onError={() => setImageError(true)}
        sx={{ 
          objectFit: 'cover',
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          }
        }}
      />
      
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="h6" component="h3" gutterBottom sx={{ 
          fontWeight: 600,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {product.name}
        </Typography>
        
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Chip 
            label={product.category} 
            size="small" 
            variant="outlined"
            sx={{ fontSize: '0.7rem' }}
          />
          {product.brand && (
            <Chip 
              label={product.brand} 
              size="small" 
              variant="outlined"
              color="primary"
              sx={{ fontSize: '0.7rem' }}
            />
          )}
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ 
          mb: 2,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {product.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating 
            value={product.rating?.average || 0} 
            readOnly 
            size="small" 
            sx={{ mr: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            ({product.rating?.count || 0})
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
              ₹{product.discountPrice || product.price}
            </Typography>
            {product.discountPrice && (
              <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                ₹{product.price}
              </Typography>
            )}
          </Box>
          
          <Button
            variant="contained"
            size="small"
            startIcon={<AddShoppingCart />}
            onClick={() => onAddToCart(product)}
            sx={{ 
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none'
            }}
          >
            Add to Cart
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const RecommendationSection = ({ 
  title = "Recommended Products", 
  subtitle,
  userId,
  limit = 8 
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        // Try to get personalized recommendations first
        if (userId) {
          const response = await recommendationAPI.getPersonalized(limit);
          setRecommendations(response.data.recommendations || []);
        } else {
          // Fallback to trending products
          const response = await recommendationAPI.getTrending();
          setRecommendations(response.data.products.map(product => ({
            product,
            score: 0.8,
            reason: 'Trending product',
            type: 'popularity'
          })));
        }
      } catch (err) {
        console.error('Recommendation error:', err);
        setError('Failed to load recommendations. Using sample data.');
        // Use sample data as fallback
        setRecommendations(generateSampleRecommendations());
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId, limit]);

  const handleAddToCart = (product) => {
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = currentCart.find(item => item._id === product._id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentCart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(currentCart));
    
    // Show success feedback (you can replace this with a proper notification system)
    console.log(`${product.name} added to cart!`);
  };

  const generateSampleRecommendations = () => {
    const sampleProducts = [
      {
        _id: '1',
        name: 'Premium Basmati Rice - 25kg Bag',
        category: 'Groceries',
        price: 2450,
        brand: 'India Gate',
        description: 'Premium long grain basmati rice, perfect for commercial use',
        images: [{ url: '/api/placeholder/300/200' }],
        rating: { average: 4.5, count: 124 }
      },
      // Add more sample products...
    ];

    return sampleProducts.map(product => ({
      product,
      score: Math.random() * 0.3 + 0.7, // Random score between 0.7-1.0
      reason: 'Popular among similar businesses',
      type: 'collaborative'
    }));
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading personalized recommendations...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {recommendations.map((recommendation, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <RecommendationCard 
              recommendation={recommendation}
              onAddToCart={handleAddToCart}
            />
          </Grid>
        ))}
      </Grid>

      {recommendations.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No recommendations available yet.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Start browsing products to get personalized suggestions!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default RecommendationSection;
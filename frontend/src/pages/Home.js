import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Button, Badge, Spinner, Alert, Tabs, Tab, 
  Modal, ProgressBar, Table, Form
} from 'react-bootstrap';
import { recommendationService } from '../services/api';

const Home = () => {
  const [recommendations, setRecommendations] = useState({
    personalized: [],
    trending: [],
    collaborative: []
  });
  const [activeTab, setActiveTab] = useState('personalized');
  const [loading, setLoading] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [businessMetrics, setBusinessMetrics] = useState(null);
  const [retentionData, setRetentionData] = useState(null);
  const [liveWeather, setLiveWeather] = useState(null);
  const [userLocation, setUserLocation] = useState({ city: 'Guntur', state: 'Andhra Pradesh' });
  const [businessType, setBusinessType] = useState('kirana');
  const [apiStatus, setApiStatus] = useState('connecting'); // connecting, live, demo
  const [error, setError] = useState(null);

  // Enhanced cities list with states
  const cities = [
    { name: 'Guntur', state: 'Andhra Pradesh' },
    { name: 'Delhi', state: 'Delhi' },
    { name: 'Bangalore', state: 'Karnataka' },
    { name: 'Hyderabad', state: 'Telangana' },
    { name: 'Chennai', state: 'Tamil Nadu' },
    { name: 'Kolkata', state: 'West Bengal' },
    { name: 'Pune', state: 'Maharashtra' },
    { name: 'Ahmedabad', state: 'Gujarat' },
    { name: 'Jaipur', state: 'Rajasthan' },
    { name: 'Lucknow', state: 'Uttar Pradesh' },
    { name: 'Surat', state: 'Gujarat' },
    { name: 'Kanpur', state: 'Uttar Pradesh' },
    { name: 'Nagpur', state: 'Maharashtra' },
    { name: 'Patna', state: 'Bihar' },
    { name: 'Indore', state: 'Madhya Pradesh' },
    { name: 'Thane', state: 'Maharashtra' },
    { name: 'Bhopal', state: 'Madhya Pradesh' },
    { name: 'Visakhapatnam', state: 'Andhra Pradesh' },
    { name: 'Vadodara', state: 'Gujarat' },
    { name: 'Coimbatore', state: 'Tamil Nadu' }
  ];

  // Enhanced business types
  const businessTypes = [
    { value: 'kirana', label: 'Kirana Store', icon: '🏪' },
    { value: 'supermarket', label: 'Supermarket', icon: '🛒' },
    { value: 'restaurant', label: 'Restaurant', icon: '🍽️' },
    { value: 'hotel', label: 'Hotel', icon: '🏨' },
    { value: 'cafe', label: 'Cafe', icon: '☕' },
    { value: 'catering', label: 'Catering Service', icon: '👨‍🍳' },
    { value: 'bakery', label: 'Bakery', icon: '🍞' },
    { value: 'food_truck', label: 'Food Truck', icon: '🚚' },
    { value: 'cloud_kitchen', label: 'Cloud Kitchen', icon: '🏠' },
    { value: 'institutional', label: 'Institutional Canteen', icon: '🏢' },
    { value: 'confectionery', label: 'Confectionery', icon: '🍬' },
    { value: 'juice_center', label: 'Juice Center', icon: '🥤' },
    { value: 'dairy_shop', label: 'Dairy Shop', icon: '🥛' },
    { value: 'meat_shop', label: 'Meat Shop', icon: '🥩' },
    { value: 'organic_store', label: 'Organic Store', icon: '🌱' }
  ];

  // KEEP YOUR EXISTING DEMO DATA AS FALLBACK
  const businessImpactData = {
    aovGrowth: [
      { month: 'Month 1', beforeAI: 10000, afterAI: 10500, growth: 5 },
      { month: 'Month 2', beforeAI: 10200, afterAI: 11200, growth: 9.8 },
      { month: 'Month 3', beforeAI: 10100, afterAI: 11800, growth: 16.8 },
      { month: 'Month 4', beforeAI: 10300, afterAI: 12500, growth: 21.4 },
      { month: 'Month 5', beforeAI: 10400, afterAI: 13200, growth: 26.9 },
      { month: 'Month 6', beforeAI: 10200, afterAI: 13800, growth: 35.3 }
    ],
    retentionRate: [
      { month: 'Month 1', beforeAI: 65, afterAI: 72, improvement: 7 },
      { month: 'Month 2', beforeAI: 64, afterAI: 76, improvement: 12 },
      { month: 'Month 3', beforeAI: 63, afterAI: 79, improvement: 16 },
      { month: 'Month 4', beforeAI: 62, afterAI: 82, improvement: 20 },
      { month: 'Month 5', beforeAI: 61, afterAI: 85, improvement: 24 },
      { month: 'Month 6', beforeAI: 60, afterAI: 88, improvement: 28 }
    ],
    productDiscovery: [
      { month: 'Month 1', discovered: 12, relevant: 8, efficiency: 67 },
      { month: 'Month 2', discovered: 18, relevant: 14, efficiency: 78 },
      { month: 'Month 3', discovered: 25, relevant: 21, efficiency: 84 },
      { month: 'Month 4', discovered: 32, relevant: 28, efficiency: 88 },
      { month: 'Month 5', discovered: 40, relevant: 36, efficiency: 90 },
      { month: 'Month 6', discovered: 48, relevant: 44, efficiency: 92 }
    ]
  };

  const personalizedProducts = [
    {
      _id: '1',
      name: 'Premium Basmati Rice - 25kg Bag',
      description: 'AI analysis shows 92% match with your Kirana store customer preferences',
      price: 2500,
      category: 'Grains',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300',
      aiScore: 92,
      businessImpact: "18% AOV increase when bundled with pulses",
      problemSolved: "Addresses repetitive purchase patterns by introducing premium alternative",
      customerRetention: "85% repeat purchase rate among similar stores"
    },
    {
      _id: '2',
      name: 'Sunflower Oil - 15L Can',
      description: 'Weather-based recommendation: High demand during current season',
      price: 1800,
      category: 'Oils',
      image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300',
      aiScore: 87,
      businessImpact: "12% sales boost in current weather conditions",
      problemSolved: "Seasonal demand fluctuations addressed",
      customerRetention: "78% repeat purchase rate"
    },
    {
      _id: '3',
      name: 'Turmeric Powder - 5kg Pack',
      description: 'Location-based trending: High demand in your area',
      price: 1200,
      category: 'Spices',
      image: 'https://images.unsplash.com/photo-1596040033221-9ae5c6f5d134?w=300',
      aiScore: 95,
      businessImpact: "22% margin improvement through bulk purchases",
      problemSolved: "Inventory optimization for high-turnover items",
      customerRetention: "91% repeat purchase rate"
    }
  ];

  const trendingProducts = [
    {
      _id: '4',
      name: 'Organic Toor Dal - 20kg Bag',
      description: '🔥 Trending: 45% increase in purchases this month',
      price: 2800,
      category: 'Pulses',
      image: 'https://images.unsplash.com/photo-1596040033221-9ae5c6f5d134?w=300',
      trendingScore: 94,
      trendReason: "Seasonal favorite with 60% adoption rate"
    },
    {
      _id: '5',
      name: 'Filter Coffee Powder - 10kg',
      description: '🔥 Hot: 32% more orders in your locality',
      price: 3200,
      category: 'Beverages',
      image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300',
      trendingScore: 88,
      trendReason: "Weather-appropriate beverage trending"
    }
  ];

  const collaborativeProducts = [
    {
      _id: '6',
      name: 'Wheat Flour - 40kg Bag',
      description: '👥 89% of similar stores stock this regularly',
      price: 1600,
      category: 'Flour',
      image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300',
      similarStores: 89,
      successRate: "94%",
      adoptionRate: 76
    },
    {
      _id: '7',
      name: 'Sugar - 50kg Bag',
      description: '👥 92% success rate among restaurants in your area',
      price: 2800,
      category: 'Sweeteners',
      image: 'https://images.unsplash.com/photo-1589923188461-293613103740?w=300',
      similarStores: 92,
      successRate: "96%",
      adoptionRate: 82
    }
  ];

  // Demo product images for fallback
  const demoImages = {
    1: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300',
    2: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300',
    3: 'https://images.unsplash.com/photo-1596040033221-9ae5c6f5d134?w=300',
    4: 'https://images.unsplash.com/photo-1596040033221-9ae5c6f5d134?w=300',
    5: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300',
    6: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300',
    7: 'https://images.unsplash.com/photo-1589923188461-293613103740?w=300'
  };

  useEffect(() => {
    loadLiveRecommendations();
    loadBusinessMetrics();
  }, []);

  const loadLiveRecommendations = async () => {
    try {
      setLoading(true);
      setApiStatus('connecting');
      
      // Get user data
      const user = JSON.parse(localStorage.getItem('user')) || {};
      const location = user.location || { city: 'Mumbai', state: 'Maharashtra' };
      const businessType = user.businessType || 'kirana';
      
      setUserLocation(location);
      setBusinessType(businessType);

      // Try to get live weather data
      try {
        const weatherResponse = await recommendationService.getWeather(location.city);
        if (weatherResponse.data && weatherResponse.data.weather) {
          setLiveWeather(weatherResponse.data.weather);
          setApiStatus('live');
        }
      } catch (weatherError) {
        console.log('Weather API not available, continuing without weather data');
      }

      // Try to get real recommendations from your backend
      try {
        const [personalizedRes, trendingRes, collaborativeRes] = await Promise.all([
          recommendationService.getPersonalized(location, businessType),
          recommendationService.getTrending(location),
          recommendationService.getCollaborative(location, businessType)
        ]);

        // Use real data if available and valid
        const realPersonalized = personalizedRes.data?.recommendations || personalizedRes.data;
        const realTrending = trendingRes.data?.trending || trendingRes.data;
        const realCollaborative = collaborativeRes.data?.recommendations || collaborativeRes.data;

        if (realPersonalized && realPersonalized.length > 0) {
          setRecommendations({
            personalized: realPersonalized,
            trending: realTrending && realTrending.length > 0 ? realTrending : trendingProducts,
            collaborative: realCollaborative && realCollaborative.length > 0 ? realCollaborative : collaborativeProducts
          });
          setApiStatus('live');
        } else {
          // Fallback to demo data
          throw new Error('No real data received');
        }
      } catch (apiError) {
        throw new Error('API not configured');
      }

    } catch (error) {
      console.log('Using demo data:', error.message);
      setApiStatus('demo');
      setError('Using demo data. Configure API keys for live weather and location-based recommendations.');
      setRecommendations({
        personalized: personalizedProducts,
        trending: trendingProducts,
        collaborative: collaborativeProducts
      });
    } finally {
      setLoading(false);
    }
  };

  const loadBusinessMetrics = () => {
    // Keep using demo business metrics
    setBusinessMetrics(businessImpactData);
    
    const initialRetention = 65;
    const currentRetention = 88;
    const improvement = ((currentRetention - initialRetention) / initialRetention) * 100;
    
    setRetentionData({
      initial: initialRetention,
      current: currentRetention,
      improvement: improvement.toFixed(1)
    });
  };

  const handleLocationChange = (newCity) => {
    const selectedCity = cities.find(city => city.name === newCity);
    const newLocation = { 
      city: selectedCity.name, 
      state: selectedCity.state 
    };
    setUserLocation(newLocation);
    loadLiveRecommendations();
  };

  const handleBusinessTypeChange = (newBusinessType) => {
    setBusinessType(newBusinessType);
    loadLiveRecommendations();
  };

  const showAIAnalysis = (product) => {
    setSelectedProduct(product);
    setShowAnalysis(true);
  };

  // Enhanced ProductCard with API status indicator and live data
  const ProductCard = ({ product, type }) => {
    const getBadgeInfo = () => {
      switch(type) {
        case 'personalized':
          return { text: 'AI Recommended', color: 'info', icon: '🤖' };
        case 'trending':
          return { text: 'Trending', color: 'success', icon: '📈' };
        case 'collaborative':
          return { text: 'Proven Success', color: 'warning', icon: '👥' };
        default:
          return { text: 'Featured', color: 'primary', icon: '⭐' };
      }
    };

    const badgeInfo = getBadgeInfo();

    return (
      <Card className="h-100 shadow-sm product-card" style={{ transition: 'all 0.3s ease' }}>
        <div className="position-relative">
          <Card.Img 
            variant="top" 
            src={product.image || demoImages[product._id || product.id]} 
            style={{ height: '200px', objectFit: 'cover' }}
          />
          <Badge bg={badgeInfo.color} className="position-absolute top-0 start-0 m-2">
            {badgeInfo.icon} {badgeInfo.text}
          </Badge>
          
          {/* API STATUS BADGE */}
          {apiStatus === 'live' && (
            <Badge bg="success" className="position-absolute top-0 end-0 m-2">
              🌡️ Live Data
            </Badge>
          )}
          
          {/* Score Badge */}
          <div className="position-absolute top-0 end-0 m-2" style={apiStatus === 'live' ? {top: '40px'} : {}}>
            <div className="bg-dark bg-opacity-75 rounded p-1 text-white small">
              {type === 'personalized' && `AI Score: ${product.aiScore || product.recommendationScore}%`}
              {type === 'trending' && `Trend: ${product.trendingScore || product.trendScore}%`}
              {type === 'collaborative' && `Adoption: ${product.adoptionRate || product.similarStores}%`}
            </div>
          </div>
        </div>
        
        <Card.Body className="d-flex flex-column">
          <Card.Title className="h6" style={{ fontSize: '0.95rem', minHeight: '40px' }}>
            {product.name}
          </Card.Title>
          
          {/* LIVE WEATHER & LOCATION INDICATOR */}
          {apiStatus === 'live' && (
            <div className="mb-2">
              {liveWeather && (
                <Badge bg="info" className="me-1 small">
                  🌤️ {liveWeather.condition} • {Math.round(liveWeather.temperature)}°C
                </Badge>
              )}
              <Badge bg="secondary" className="small">
                📍 {userLocation.city}
              </Badge>
            </div>
          )}
          
          <Card.Text className="flex-grow-1 text-muted small mb-3" style={{ minHeight: '60px' }}>
            {product.description}
          </Card.Text>
          
          {/* Live Data Factors */}
          {product.factors && apiStatus === 'live' && (
            <div className="mb-2">
              {product.factors.slice(0, 2).map((factor, idx) => (
                <Badge key={idx} bg="outline-info" className="me-1 mb-1 small">
                  {factor}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Problem Solution Badge */}
          <div className="mb-2">
            <Badge bg="outline-danger" className="small">
              💡 Solves: {type === 'personalized' ? 'Repetitive Patterns' : 
                         type === 'trending' ? 'Poor Discovery' : 'Low Retention'}
            </Badge>
          </div>

          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="h5 text-primary mb-0">
                ₹{product.finalPrice || product.price}
                {product.basePrice && product.finalPrice !== product.basePrice && (
                  <small className="text-muted text-decoration-line-through ms-1">
                    ₹{product.basePrice}
                  </small>
                )}
              </span>
              <Badge bg="outline-secondary" text="dark" className="border">
                {product.category}
              </Badge>
            </div>
            
            <div className="d-grid gap-2">
              <Button variant="primary" size="sm" className="fw-semibold">
                <i className="bi bi-cart-plus me-1"></i>
                Add to Cart
              </Button>
              <Button 
                variant="outline-info" 
                size="sm" 
                onClick={() => showAIAnalysis(product)}
              >
                <i className="bi bi-graph-up me-1"></i>
                Business Impact
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };

  // Enhanced Live Weather Dashboard with more cities and business types
  const LiveWeatherDashboard = () => (
    <Card className="mb-4 border-0 shadow-sm bg-gradient-primary text-white">
      <Card.Body>
        <Row className="align-items-center">
          <Col md={6}>
            <h5 className="mb-1">
              <i className="bi bi-geo-alt me-2"></i>
              {apiStatus === 'live' ? 'Live Market Intelligence' : 'AI Market Intelligence'}
            </h5>
            <p className="mb-0 opacity-75">
              {userLocation?.city ? 
                `Recommendations for ${userLocation.city}, ${userLocation.state}` : 
                'Intelligent product recommendations'
              }
            </p>
          </Col>
          <Col md={6}>
            <Row className="align-items-center">
              <Col md={6}>
                {liveWeather && apiStatus === 'live' ? (
                  <div className="text-center">
                    <div className="h3 mb-0">{Math.round(liveWeather.temperature)}°C</div>
                    <small className="opacity-75">{liveWeather.condition}</small>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="h3 mb-0">AI</div>
                    <small className="opacity-75">Powered</small>
                  </div>
                )}
              </Col>
              <Col md={6}>
                <div className="text-end">
                  <Badge bg={apiStatus === 'live' ? 'success' : 'warning'} className="fs-6">
                    {apiStatus === 'live' ? '🌡️ Live Data' : '🤖 AI Demo'}
                  </Badge>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Enhanced Location and Business Type Controls */}
        <Row className="mt-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label className="text-white mb-1">
                <i className="bi bi-geo-alt me-1"></i>
                Location
              </Form.Label>
              <Form.Select 
                size="sm"
                value={userLocation.city}
                onChange={(e) => handleLocationChange(e.target.value)}
              >
                {cities.map(city => (
                  <option key={city.name} value={city.name}>
                    {city.name}, {city.state}
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-white-50">
                Select your city for location-based recommendations
              </Form.Text>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="text-white mb-1">
                <i className="bi bi-building me-1"></i>
                Business Type
              </Form.Label>
              <Form.Select 
                size="sm"
                value={businessType}
                onChange={(e) => handleBusinessTypeChange(e.target.value)}
              >
                {businessTypes.map(business => (
                  <option key={business.value} value={business.value}>
                    {business.icon} {business.label}
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-white-50">
                Choose your business type for personalized AI recommendations
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        {/* Quick Stats */}
        <Row className="mt-3 text-center">
          <Col md={4}>
            <div className="border rounded p-2 bg-white bg-opacity-10">
              <div className="text-warning fw-bold">{cities.length}+</div>
              <small className="opacity-75">Cities Covered</small>
            </div>
          </Col>
          <Col md={4}>
            <div className="border rounded p-2 bg-white bg-opacity-10">
              <div className="text-info fw-bold">{businessTypes.length}+</div>
              <small className="opacity-75">Business Types</small>
            </div>
          </Col>
          <Col md={4}>
            <div className="border rounded p-2 bg-white bg-opacity-10">
              <div className="text-success fw-bold">24/7</div>
              <small className="opacity-75">Live Updates</small>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  // API Status Alert Component
  const APIStatusAlert = () => {
    if (apiStatus === 'connecting') {
      return (
        <Alert variant="info" className="d-flex align-items-center">
          <Spinner animation="border" size="sm" className="me-2" />
          Connecting to real-time AI recommendations...
        </Alert>
      );
    }
    
    if (apiStatus === 'demo') {
      return (
        <Alert variant="warning" className="d-flex align-items-center">
          <i className="bi bi-info-circle me-2"></i>
          {error || 'Live data temporarily unavailable. Showing demo recommendations with real AI logic.'}
        </Alert>
      );
    }
    
    if (apiStatus === 'live') {
      return (
        <Alert variant="success" className="d-flex align-items-center">
          <i className="bi bi-check-circle me-2"></i>
          Connected to live AI recommendations for {userLocation?.city || 'Mumbai'}
          {liveWeather && ` • ${liveWeather.condition}, ${liveWeather.temperature}°C`}
          <br />
          <small>Business Type: {businessTypes.find(b => b.value === businessType)?.label}</small>
        </Alert>
      );
    }
    
    return null;
  };

  // KEEP ALL YOUR EXISTING COMPONENTS
  const AIAnalysisModal = () => (
    <Modal show={showAnalysis} onHide={() => setShowAnalysis(false)} size="lg">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <i className="bi bi-robot me-2"></i>
          {apiStatus === 'live' ? 'Live AI Business Impact Analysis' : 'AI Business Impact Analysis'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedProduct && (
          <>
            <div className="row">
              <div className="col-md-4">
                <img 
                  src={selectedProduct.image || demoImages[selectedProduct._id || selectedProduct.id]} 
                  alt={selectedProduct.name}
                  className="img-fluid rounded"
                  style={{ maxHeight: '200px', objectFit: 'cover' }}
                />
              </div>
              <div className="col-md-8">
                <h4>{selectedProduct.name}</h4>
                <p className="text-muted">{selectedProduct.description}</p>
                
                {/* API Status Badge in Modal */}
                {apiStatus === 'live' && (
                  <div className="mb-3">
                    <Badge bg="success" className="me-2">
                      🌡️ Live Market Data
                    </Badge>
                    <Badge bg="info" className="me-2">
                      📍 {userLocation.city}
                    </Badge>
                    <Badge bg="warning">
                      🏪 {businessTypes.find(b => b.value === businessType)?.label}
                    </Badge>
                  </div>
                )}
                
                <div className="row text-center mb-3">
                  <div className="col-4">
                    <div className="border rounded p-2 bg-light">
                      <div className="text-success fw-bold">15-20%</div>
                      <small>AOV Increase</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="border rounded p-2 bg-light">
                      <div className="text-primary fw-bold">
                        {selectedProduct.aiScore || selectedProduct.recommendationScore || selectedProduct.trendingScore || selectedProduct.similarStores}%
                      </div>
                      <small>Success Probability</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="border rounded p-2 bg-light">
                      <div className="text-warning fw-bold">25%</div>
                      <small>Retention Boost</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr />
            
            <h5>🎯 Problem Statement Addressed</h5>
            <Alert variant="info">
              <strong>{selectedProduct.problemSolved || "Addresses key challenges in retailer experience"}</strong>
            </Alert>

            <h6>📊 Expected Business Impact</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                {selectedProduct.businessImpact || "15-20% AOV growth potential"}
              </li>
              <li className="mb-2">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                {selectedProduct.customerRetention || "25% improvement in customer retention"}
              </li>
              <li className="mb-2">
                <i className="bi bi-check-circle-fill text-success me-2"></i>
                Reduces retailer inactivity from 35% to under 15%
              </li>
            </ul>

            {/* Live Data Factors */}
            {selectedProduct.factors && apiStatus === 'live' && (
              <>
                <h6>🌍 Live Market Factors</h6>
                <div className="row">
                  {selectedProduct.factors.map((factor, idx) => (
                    <div key={idx} className="col-md-6 mb-2">
                      <Badge bg="outline-info" className="w-100">
                        {factor}
                      </Badge>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="alert alert-success small">
              <i className="bi bi-lightbulb me-2"></i>
              <strong>AI Insight:</strong> This recommendation directly targets the 60% product discovery gap 
              and addresses stagnant order values through intelligent cross-selling.
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );

  const BusinessMetricsDashboard = () => (
    <Card className="border-0 shadow-sm mt-5">
      <Card.Header className="bg-dark text-white">
        <h4 className="mb-0">
          <i className="bi bi-graph-up me-2"></i>
          {apiStatus === 'live' ? 'Live ' : ''}6-Month Business Impact Analytics
        </h4>
      </Card.Header>
      <Card.Body>
        <Tabs defaultActiveKey="aov" className="mb-4">
          <Tab eventKey="aov" title="📈 AOV Growth">
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="table-dark">
                  <tr>
                    <th>Month</th>
                    <th>Before AI (₹)</th>
                    <th>After AI (₹)</th>
                    <th>Growth %</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {businessMetrics?.aovGrowth.map((data, index) => (
                    <tr key={index}>
                      <td>{data.month}</td>
                      <td>₹{data.beforeAI.toLocaleString()}</td>
                      <td>₹{data.afterAI.toLocaleString()}</td>
                      <td>
                        <Badge bg={data.growth > 20 ? "success" : data.growth > 10 ? "warning" : "info"}>
                          +{data.growth}%
                        </Badge>
                      </td>
                      <td>
                        <ProgressBar 
                          now={data.growth} 
                          max={35}
                          variant={data.growth > 20 ? "success" : data.growth > 10 ? "warning" : "info"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Tab>
          
          <Tab eventKey="retention" title="👥 Retention Rate">
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="table-dark">
                  <tr>
                    <th>Month</th>
                    <th>Before AI (%)</th>
                    <th>After AI (%)</th>
                    <th>Improvement</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {businessMetrics?.retentionRate.map((data, index) => (
                    <tr key={index}>
                      <td>{data.month}</td>
                      <td>{data.beforeAI}%</td>
                      <td>{data.afterAI}%</td>
                      <td>
                        <Badge bg="success">+{data.improvement}%</Badge>
                      </td>
                      <td>
                        <ProgressBar 
                          now={data.afterAI} 
                          variant="success"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Tab>
          
          <Tab eventKey="discovery" title="🔍 Product Discovery">
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="table-dark">
                  <tr>
                    <th>Month</th>
                    <th>Products Discovered</th>
                    <th>Relevant Products</th>
                    <th>Efficiency %</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {businessMetrics?.productDiscovery.map((data, index) => (
                    <tr key={index}>
                      <td>{data.month}</td>
                      <td>{data.discovered}</td>
                      <td>{data.relevant}</td>
                      <td>
                        <Badge bg={data.efficiency > 85 ? "success" : data.efficiency > 75 ? "warning" : "info"}>
                          {data.efficiency}%
                        </Badge>
                      </td>
                      <td>
                        <ProgressBar 
                          now={data.efficiency} 
                          variant={data.efficiency > 85 ? "success" : data.efficiency > 75 ? "warning" : "info"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  );

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <div className="py-5">
          <Spinner animation="border" role="status" variant="primary" size="lg" />
          <h4 className="mt-3 text-primary">
            {apiStatus === 'connecting' ? 'Connecting to Live AI...' : 'Analyzing Retailer Business Patterns...'}
          </h4>
          <p className="text-muted">Our AI is processing purchase history and behavioral data</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4 bg-light min-vh-100">
      <Container>
        {/* Enhanced Live Weather Dashboard */}
        <LiveWeatherDashboard />

        {/* API Status Alert */}
        <APIStatusAlert />

        {/* Problem Statement Header */}
        <Card className="border-0 shadow-sm mb-4 bg-gradient-danger text-white">
          <Card.Body className="text-center py-4">
            <h3 className="mb-3">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Solving B2B Retail Challenges
            </h3>
            <Row className="g-4">
              <Col md={3}>
                <div className="text-center">
                  <div className="display-6 fw-bold">60%+</div>
                  <small>Relevant Products Missed by Retailers</small>
                </div>
              </Col>
              <Col md={3}>
                <div className="text-center">
                  <div className="display-6 fw-bold">35%</div>
                  <small>Retailer Inactivity within 6 Months</small>
                </div>
              </Col>
              <Col md={3}>
                <div className="text-center">
                  <div className="display-6 fw-bold">0%</div>
                  <small>AOV Growth (Stagnant)</small>
                </div>
              </Col>
              <Col md={3}>
                <div className="text-center">
                  <div className="display-6 fw-bold">
                    {apiStatus === 'live' ? '🌡️ Live' : '🤖 AI'}
                  </div>
                  <small>Solution Implementation</small>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Main Recommendation Engine */}
        <Card className="shadow border-0 mb-4">
          <Card.Header className="bg-white border-0 py-4">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h3 className="mb-1">
                  <i className="bi bi-robot text-primary me-2"></i>
                  {apiStatus === 'live' ? 'Live AI-Powered Product Recommendations' : 'AI-Powered Product Recommendations'}
                </h3>
                <p className="text-muted mb-0">
                  Addressing B2B marketplace challenges through intelligent suggestions
                </p>
              </div>
              <div className="col-md-4 text-end">
                <Badge bg="success" className="fs-6">
                  Target: 15-20% AOV Increase
                </Badge>
              </div>
            </div>
          </Card.Header>
          
          <Card.Body className="p-0">
            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="px-4 pt-3" fill>
              <Tab eventKey="personalized" title="🤖 AI Personalized">
                <Row className="p-3">
                  {recommendations.personalized.map(product => (
                    <Col key={product._id || product.id} sm={6} lg={4} className="mb-4">
                      <ProductCard product={product} type="personalized" />
                    </Col>
                  ))}
                </Row>
              </Tab>
              
              <Tab eventKey="trending" title="🔥 Live Trending">
                <Row className="p-3">
                  {recommendations.trending.map(product => (
                    <Col key={product._id || product.id} sm={6} lg={4} className="mb-4">
                      <ProductCard product={product} type="trending" />
                    </Col>
                  ))}
                </Row>
              </Tab>
              
              <Tab eventKey="collaborative" title="👥 Collaborative">
                <Row className="p-3">
                  {recommendations.collaborative.map(product => (
                    <Col key={product._id || product.id} sm={6} lg={4} className="mb-4">
                      <ProductCard product={product} type="collaborative" />
                    </Col>
                  ))}
                </Row>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>

        {/* Business Impact Analytics */}
        {businessMetrics && <BusinessMetricsDashboard />}

        {/* Results Summary */}
        <Card className="border-0 shadow-sm bg-gradient-success text-white mt-4">
          <Card.Body className="text-center py-5">
            <h3 className="mb-3">
              <i className="bi bi-trophy me-2"></i>
              {apiStatus === 'live' ? 'Live AI Implementation Results' : 'AI Implementation Results'} (6 Months)
            </h3>
            <Row className="g-4">
              <Col md={4}>
                <div className="text-center">
                  <div className="display-4 fw-bold">35.3%</div>
                  <small>AOV Growth Achieved</small>
                </div>
              </Col>
              <Col md={4}>
                <div className="text-center">
                  <div className="display-4 fw-bold">28%</div>
                  <small>Retention Improvement</small>
                </div>
              </Col>
              <Col md={4}>
                <div className="text-center">
                  <div className="display-4 fw-bold">92%</div>
                  <small>Discovery Efficiency</small>
                </div>
              </Col>
            </Row>
            <div className="mt-4">
              <Badge bg="light" text="dark" className="me-2">35% Inactivity → 12%</Badge>
              <Badge bg="light" text="dark" className="me-2">60% Discovery Gap → 8%</Badge>
              <Badge bg="light" text="dark">Stagnant AOV → 35% Growth</Badge>
            </div>
          </Card.Body>
        </Card>

        <AIAnalysisModal />
      </Container>

      <style jsx>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .bg-gradient-danger {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        .bg-gradient-success {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        .product-card {
          transition: all 0.3s ease;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
      `}</style>
    </Container>
  );
};

export default Home;
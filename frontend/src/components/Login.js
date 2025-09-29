import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Tabs, Tab } from 'react-bootstrap';
import { authService } from '../services/api';

const Auth = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  // Form states
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessType: 'kirana',
    location: {
      city: '',
      state: '',
      address: ''
    }
  });

  // Get user's live location
  const getLiveLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Simple reverse geocoding using a free API
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            
            const detectedLocation = {
              lat: latitude,
              lng: longitude,
              city: data.city || 'Mumbai',
              state: data.principalSubdivision || 'Maharashtra',
              address: data.locality || 'Current Location'
            };

            setUserLocation(detectedLocation);

            // Auto-fill signup form with detected location
            setSignupData(prev => ({
              ...prev,
              location: {
                city: detectedLocation.city,
                state: detectedLocation.state,
                address: detectedLocation.address
              }
            }));

            setSuccessMessage(`📍 Location detected: ${detectedLocation.city}, ${detectedLocation.state}`);
          } catch (error) {
            // Fallback to default location
            const defaultLocation = {
              lat: latitude,
              lng: longitude,
              city: 'Mumbai',
              state: 'Maharashtra',
              address: 'Live Location'
            };
            setUserLocation(defaultLocation);
            setSignupData(prev => ({
              ...prev,
              location: {
                city: defaultLocation.city,
                state: defaultLocation.state,
                address: defaultLocation.address
              }
            }));
            setSuccessMessage('📍 Live location enabled!');
          }
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Location access denied. Please enter your location manually.');
          setLoading(false);
        },
        {
          timeout: 10000,
          enableHighAccuracy: true
        }
      );
    } else {
      setError('Geolocation is not supported by this browser. Please enter location manually.');
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await authService.login(loginData);
      localStorage.setItem('token', response.data.token);
      
      // Store user data with location
      const userWithLocation = {
        ...response.data.user,
        location: userLocation || response.data.user.location || { city: 'Mumbai', state: 'Maharashtra' }
      };
      localStorage.setItem('user', JSON.stringify(userWithLocation));
      
      onLogin(userWithLocation);
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.register({
        ...signupData,
        location: userLocation || signupData.location
      });
      
      // Show success message and switch to login tab
      setSuccessMessage('✅ Account created successfully! Please login with your credentials.');
      setActiveTab('login');
      
      // Pre-fill login email
      setLoginData({ email: signupData.email, password: '' });
      
      // Clear signup form
      setSignupData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        businessType: 'kirana',
        location: { city: '', state: '', address: '' }
      });
      
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (type) => {
    const demoAccounts = {
      kirana: { 
        email: 'kirana@demo.com', 
        password: 'demo123',
        userData: {
          id: '1',
          name: 'Kirana Store Owner',
          email: 'kirana@demo.com',
          businessType: 'Kirana Store',
          location: {
            city: 'Mumbai',
            state: 'Maharashtra',
            address: '123 Kirana Street',
            lat: 19.0760,
            lng: 72.8777
          }
        }
      },
      restaurant: { 
        email: 'restaurant@demo.com', 
        password: 'demo123',
        userData: {
          id: '2',
          name: 'Restaurant Owner',
          email: 'restaurant@demo.com',
          businessType: 'Restaurant',
          location: {
            city: 'Delhi',
            state: 'Delhi',
            address: '456 Food Street',
            lat: 28.7041,
            lng: 77.1025
          }
        }
      },
      hotel: { 
        email: 'hotel@demo.com', 
        password: 'demo123',
        userData: {
          id: '3',
          name: 'Hotel Manager',
          email: 'hotel@demo.com',
          businessType: 'Hotel',
          location: {
            city: 'Bangalore',
            state: 'Karnataka',
            address: '789 Hotel Avenue',
            lat: 12.9716,
            lng: 77.5946
          }
        }
      }
    };
    
    const account = demoAccounts[type];
    setLoginData({ email: account.email, password: account.password });
    
    // Auto-login demo account with location
    setTimeout(() => {
      localStorage.setItem('token', 'demo-token-' + type);
      localStorage.setItem('user', JSON.stringify(account.userData));
      onLogin(account.userData);
    }, 500);
  };

  return (
    <Container fluid className="bg-primary min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h2 className="text-primary fw-bold">
                    <i className="bi bi-robot me-2"></i>
                    Seasro-Marketplace
                  </h2>
                  <p className="text-muted">Intelligent B2B Product Recommendations</p>
                  
                  {/* Location Status */}
                  <div className="d-flex justify-content-center align-items-center mb-3">
                    <Button 
                      variant="outline-info" 
                      size="sm" 
                      onClick={getLiveLocation}
                      disabled={loading}
                    >
                      <i className="bi bi-geo-alt me-1"></i>
                      {userLocation ? '📍 Live Location Active' : '🌍 Detect Live Location'}
                    </Button>
                  </div>
                  
                  {userLocation && (
                    <Alert variant="success" className="py-2 small mb-3">
                      <i className="bi bi-check-circle me-1"></i>
                      Location: {userLocation.city}, {userLocation.state}
                    </Alert>
                  )}
                </div>

                {error && <Alert variant="danger">{error}</Alert>}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}

                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => {
                    setActiveTab(k);
                    setError('');
                    setSuccessMessage('');
                  }}
                  className="mb-3"
                  fill
                >
                  {/* Login Tab */}
                  <Tab eventKey="login" title="🔐 Sign In">
                    <Form onSubmit={handleLogin}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter your email"
                          value={loginData.email}
                          onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Enter your password"
                          value={loginData.password}
                          onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                          required
                        />
                      </Form.Group>

                      <Button 
                        variant="primary" 
                        type="submit" 
                        className="w-100 py-2" 
                        disabled={loading}
                      >
                        {loading ? <Spinner size="sm" /> : '🚀 Sign In'}
                      </Button>
                    </Form>
                  </Tab>

                  {/* Signup Tab */}
                  <Tab eventKey="signup" title="📝 Create Account">
                    <Form onSubmit={handleSignup}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter your full name"
                              value={signupData.name}
                              onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Business Type</Form.Label>
                            <Form.Select
                              value={signupData.businessType}
                              onChange={(e) => setSignupData({...signupData, businessType: e.target.value})}
                            >
                              <option value="kirana">🛒 Kirana Store</option>
                              <option value="restaurant">🍽️ Restaurant</option>
                              <option value="hotel">🏨 Hotel</option>
                              <option value="cafe">☕ Cafe</option>
                              <option value="other">🏢 Other</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter your email"
                          value={signupData.email}
                          onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                          required
                        />
                      </Form.Group>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                              type="password"
                              placeholder="Create password"
                              value={signupData.password}
                              onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                              type="password"
                              placeholder="Confirm password"
                              value={signupData.confirmPassword}
                              onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Alert variant="info" className="py-2 small">
                        <i className="bi bi-info-circle me-1"></i>
                        Location helps us provide better recommendations based on your area
                      </Alert>

                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter your city"
                              value={signupData.location.city}
                              onChange={(e) => setSignupData({
                                ...signupData, 
                                location: {...signupData.location, city: e.target.value}
                              })}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>State</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter your state"
                              value={signupData.location.state}
                              onChange={(e) => setSignupData({
                                ...signupData, 
                                location: {...signupData.location, state: e.target.value}
                              })}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Button 
                        variant="success" 
                        type="submit" 
                        className="w-100 py-2" 
                        disabled={loading}
                      >
                        {loading ? <Spinner size="sm" /> : '✅ Create Account'}
                      </Button>
                    </Form>
                  </Tab>
                </Tabs>

                <div className="text-center mt-4">
                  <p className="text-muted">Quick demo access:</p>
                  <div className="d-grid gap-2">
                    <Button variant="outline-success" size="sm" onClick={() => handleDemoLogin('kirana')}>
                      🛒 Kirana Store Demo
                    </Button>
                    <Button variant="outline-warning" size="sm" onClick={() => handleDemoLogin('restaurant')}>
                      🍽️ Restaurant Demo
                    </Button>
                    <Button variant="outline-info" size="sm" onClick={() => handleDemoLogin('hotel')}>
                      🏨 Hotel Demo
                    </Button>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <small className="text-muted">
                    By signing in, you agree to our Terms of Service
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Auth;
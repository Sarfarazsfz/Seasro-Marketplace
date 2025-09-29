import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Badge, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './pages/Home';
import Auth from './components/Login'; // Now it's Auth component with login/signup
import Products from './pages/Products';

function App() {
  const [user, setUser] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUserLocation = (location) => {
    setUserLocation(location);
  };

  return (
    <Router>
      {user && (
        <Navbar bg="white" expand="lg" className="shadow-sm border-bottom">
          <Container>
            <Navbar.Brand href="/" className="fw-bold text-primary">
              <i className="bi bi-robot me-2"></i>
              Seasro-Marketplace
            </Navbar.Brand>
            
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/" className="fw-semibold">
                  <i className="bi bi-house me-1"></i>
                  Home
                </Nav.Link>
                <Nav.Link href="/products" className="fw-semibold">
                  <i className="bi bi-grid me-1"></i>
                  Products
                </Nav.Link>
              </Nav>
              
              <Nav>
                {userLocation && (
                  <Nav.Item className="d-flex align-items-center me-3">
                    <i className="bi bi-geo-alt me-1 text-success"></i>
                    <small className="text-muted">{userLocation.city}</small>
                  </Nav.Item>
                )}
                
                <Dropdown align="end">
                  <Dropdown.Toggle variant="outline-primary" size="sm">
                    <i className="bi bi-person-circle me-1"></i>
                    {user.name}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Header>
                      <i className="bi bi-shop me-1"></i>
                      {user.businessType}
                    </Dropdown.Header>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-1"></i>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}

      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" /> : <Auth onLogin={handleLogin} />} 
        />
        <Route
          path="/products"
          element={user ? <Products /> : <Navigate to="/login" />} 
        />
        <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
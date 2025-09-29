import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Badge, Dropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const CustomNavbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setUser(userData);
    setCartCount(cart.length);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm border-bottom" sticky="top">
      <Container>
        {/* Brand Logo */}
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <div className="bg-gradient-primary rounded p-2 me-2">
            <i className="bi bi-robot text-white fs-4"></i>
          </div>
          <span className="fw-bold text-dark fs-4">Quipo</span>
          <Badge bg="success" className="ms-2 fs-7">AI</Badge>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Navigation Links */}
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link className="fw-semibold mx-2 text-dark">
                <i className="bi bi-house me-1"></i>
                Home
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/products">
              <Nav.Link className="fw-semibold mx-2 text-dark">
                <i className="bi bi-grid me-1"></i>
                Products
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/analytics">
              <Nav.Link className="fw-semibold mx-2 text-dark">
                <i className="bi bi-graph-up me-1"></i>
                Analytics
              </Nav.Link>
            </LinkContainer>
          </Nav>

          {/* Right Side Items */}
          <Nav className="align-items-center">
            {/* Cart Icon */}
            <LinkContainer to="/cart">
              <Nav.Link className="position-relative mx-2">
                <i className="bi bi-cart3 fs-5 text-dark"></i>
                {cartCount > 0 && (
                  <Badge 
                    bg="danger" 
                    className="position-absolute top-0 start-100 translate-middle"
                    style={{ fontSize: '0.6rem' }}
                  >
                    {cartCount}
                  </Badge>
                )}
              </Nav.Link>
            </LinkContainer>

            {/* Notifications */}
            <Dropdown className="mx-2">
              <Dropdown.Toggle variant="outline-light" id="dropdown-notifications" className="border-0 p-0">
                <i className="bi bi-bell fs-5 text-dark position-relative">
                  <Badge 
                    bg="warning" 
                    className="position-absolute top-0 start-100 translate-middle"
                    style={{ fontSize: '0.5rem', padding: '2px 4px' }}
                  >
                    3
                  </Badge>
                </i>
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Header>Notifications</Dropdown.Header>
                <Dropdown.Item>
                  <small>🔄 New recommendations available</small>
                </Dropdown.Item>
                <Dropdown.Item>
                  <small>🔥 Trending products updated</small>
                </Dropdown.Item>
                <Dropdown.Item>
                  <small>📊 Your business growth: +15%</small>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* User Profile */}
            <Dropdown className="mx-2">
              <Dropdown.Toggle 
                variant="outline-light" 
                id="dropdown-user" 
                className="border-0 d-flex align-items-center"
              >
                <div className="bg-gradient-primary rounded-circle p-1 me-2">
                  <i className="bi bi-person-fill text-white"></i>
                </div>
                <span className="text-dark fw-semibold">
                  {user?.name || 'User'}
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Header>
                  <div className="fw-bold">{user?.businessName || 'Your Business'}</div>
                  <small className="text-muted">{user?.businessType || 'Kirana Store'}</small>
                </Dropdown.Header>
                <Dropdown.Divider />
                <LinkContainer to="/profile">
                  <Dropdown.Item>
                    <i className="bi bi-person me-2"></i>
                    Profile
                  </Dropdown.Item>
                </LinkContainer>
                <LinkContainer to="/settings">
                  <Dropdown.Item>
                    <i className="bi bi-gear me-2"></i>
                    Settings
                  </Dropdown.Item>
                </LinkContainer>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2 text-danger"></i>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>

      <style jsx>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .fs-7 {
          font-size: 0.75rem;
        }
        .nav-link:hover {
          color: #667eea !important;
        }
      `}</style>
    </Navbar>
  );
};

export default CustomNavbar;
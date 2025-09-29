import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { productService } from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter]);

  const loadProducts = async () => {
    try {
      const response = await productService.getAll();
      setProducts(response.data || []);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts(getSampleProducts());
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(product =>
        product.category === categoryFilter
      );
    }

    setFilteredProducts(filtered);
  };

  const getSampleProducts = () => [
    {
      _id: '1',
      name: 'Premium Basmati Rice - 25kg Bag',
      description: 'Premium long grain basmati rice, perfect for commercial use',
      price: 2500,
      category: 'Grains',
      image: '/default-product.jpg',
      stock: 100
    },
    {
      _id: '2',
      name: 'Sunflower Oil - 15L Can',
      description: 'Pure sunflower oil for cooking and frying',
      price: 1800,
      category: 'Oils',
      image: '/default-product.jpg',
      stock: 50
    },
    {
      _id: '3',
      name: 'Sugar - 50kg Bag',
      description: 'Fine quality sugar for commercial use',
      price: 2200,
      category: 'Sweeteners',
      image: '/default-product.jpg',
      stock: 75
    }
  ];

  const categories = [...new Set(products.map(p => p.category))];

  const ProductCard = ({ product }) => (
    <Card className="h-100 shadow-sm product-card">
      <Card.Img 
        variant="top" 
        src={product.image || 'https://via.placeholder.com/300x200/28a745/ffffff?text=Product'} 
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="h6">{product.name}</Card.Title>
        <Card.Text className="text-muted small flex-grow-1">
          {product.description}
        </Card.Text>
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="h5 text-primary mb-0">₹{product.price}</span>
            <Badge bg={product.stock > 20 ? "success" : "warning"}>
              {product.stock > 20 ? "In Stock" : "Low Stock"}
            </Badge>
          </div>
          <small className="text-muted d-block mb-2">Category: {product.category}</small>
          <Button variant="primary" size="sm" className="w-100">
            <i className="bi bi-cart-plus me-1"></i>
            Add to Cart
          </Button>
        </div>
      </Card.Body>
    </Card>
  );

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading products...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4 bg-light min-vh-100">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="text-primary">All Products</h2>
            <p className="text-muted">Browse our complete catalog</p>
          </div>
          <Badge bg="light" text="dark" className="fs-6">
            {filteredProducts.length} products
          </Badge>
        </div>

        <Card className="shadow-sm mb-4">
          <Card.Body>
            <Row>
              <Col md={8}>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={4}>
                <Form.Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Row>
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <Col key={product._id} xs={12} sm={6} lg={4} className="mb-4">
                <ProductCard product={product} />
              </Col>
            ))
          ) : (
            <Col className="text-center py-5">
              <i className="bi bi-search display-1 text-muted"></i>
              <h4 className="text-muted mt-3">No products found</h4>
              <p>Try adjusting your search or filter criteria</p>
            </Col>
          )}
        </Row>
      </Container>
    </Container>
  );
};

export default Products;
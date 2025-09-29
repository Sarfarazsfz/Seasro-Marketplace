import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

export const recommendationService = {
  getPersonalized: (location, businessType) => 
    api.get(`/recommendations/personalized?city=${location?.city || 'Mumbai'}&businessType=${businessType || 'kirana'}`),
  
  getTrending: (location) => 
    api.get(`/recommendations/trending?city=${location?.city || 'Mumbai'}`),
  
  getCollaborative: (location, businessType) => 
    api.get(`/recommendations/collaborative?city=${location?.city || 'Mumbai'}&businessType=${businessType || 'kirana'}`),
  
  getWeather: (city) => api.get(`/recommendations/weather/${city}`),
  
  detectLocation: () => api.get('/recommendations/detect-location')
};

export const productService = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  search: (query) => api.get(`/products/search?q=${query}`),
};

export default api;
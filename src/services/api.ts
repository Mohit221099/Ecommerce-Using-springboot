import axios from 'axios';

// Create axios instance with default config
export const api = axios.create({
  baseURL: 'http://localhost:8080/api', // This will be the Spring Boot backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized, clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Product API functions
export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id: number) => api.get(`/products/${id}`),
  getByCategory: (category: string) => api.get(`/products/category/${category}`),
  search: (query: string) => api.get(`/products/search?q=${query}`),
  create: (product: any) => api.post('/products', product),
  update: (id: number, product: any) => api.put(`/products/${id}`, product),
  delete: (id: number) => api.delete(`/products/${id}`),
};

// Auth API functions
export const authAPI = {
  login: (username: string, password: string) => 
    api.post('/auth/login', { username, password }),
  register: (username: string, email: string, password: string) => 
    api.post('/auth/register', { username, email, password }),
  getCurrentUser: () => api.get('/auth/me'),
};

// Order API functions
export const orderAPI = {
  create: (order: any) => api.post('/orders', order),
  getUserOrders: () => api.get('/orders/user'),
  getAllOrders: () => api.get('/orders'), // Admin only
  updateStatus: (id: number, status: string) => api.put(`/orders/${id}/status`, { status }),
};
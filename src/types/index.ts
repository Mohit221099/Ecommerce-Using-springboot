export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  stock: number;
}

export interface Order {
  id: number;
  userId: number;
  createdAt: string;
  items: Array<{ product: Product; quantity: number }>;
  total: number;
  address: {
    fullName: string;
    streetAddress: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  orderDate: string;
  estimatedDeliveryDate: string;
  paymentMethod?: 'UPI' | 'PhonePe' | 'GooglePay' | 'Paytm' | 'COD'; // Added
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}
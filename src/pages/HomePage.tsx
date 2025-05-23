import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { Product } from '../types';
import { productAPI } from '../services/api';

const featuredCategories = [
  { name: 'Electronics', slug: 'electronics', image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Clothing', slug: 'clothing', image: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Books', slug: 'books', image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { name: 'Home & Kitchen', slug: 'home', image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800' },
];

// Mock data for development
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and long battery life.',
    price: 99.99,
    imageUrl: 'https://images.pexels.com/photos/3394666/pexels-photo-3394666.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Electronics',
    stock: 15
  },
  {
    id: 2,
    name: 'Casual T-Shirt',
    description: '100% cotton casual t-shirt, perfect for everyday wear.',
    price: 24.99,
    imageUrl: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Clothing',
    stock: 50
  },
  {
    id: 3,
    name: 'Novel - The Great Journey',
    description: 'A bestselling novel about adventure and discovery.',
    price: 18.95,
    imageUrl: 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Books',
    stock: 30
  },
  {
    id: 4,
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe.',
    price: 79.95,
    imageUrl: 'https://images.pexels.com/photos/7474372/pexels-photo-7474372.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Home & Kitchen',
    stock: 10
  },
  {
    id: 5,
    name: 'Smartphone',
    description: 'Latest model smartphone with high-resolution camera and fast processor.',
    price: 799.99,
    imageUrl: 'https://images.pexels.com/photos/1447254/pexels-photo-1447254.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Electronics',
    stock: 8
  },
  {
    id: 6,
    name: 'Winter Jacket',
    description: 'Warm winter jacket with water-resistant outer shell.',
    price: 149.99,
    imageUrl: 'https://images.pexels.com/photos/8364025/pexels-photo-8364025.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Clothing',
    stock: 20
  },
  {
    id: 7,
    name: 'Cooking Basics Cookbook',
    description: 'Learn all the basics of cooking with this illustrated cookbook.',
    price: 34.95,
    imageUrl: 'https://images.pexels.com/photos/4144234/pexels-photo-4144234.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Books',
    stock: 15
  },
  {
    id: 8,
    name: 'Blender',
    description: 'Powerful blender for smoothies and food processing.',
    price: 69.99,
    imageUrl: 'https://images.pexels.com/photos/1714422/pexels-photo-1714422.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Home & Kitchen',
    stock: 12
  },
];

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // In a real application, we would fetch from the API
        // const response = await productAPI.getAll();
        // setFeaturedProducts(response.data);
        
        // Using mock data for development
        setTimeout(() => {
          setFeaturedProducts(mockProducts);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop the Latest Trends</h1>
            <p className="text-lg md:text-xl mb-6">
              Discover quality products at affordable prices.
            </p>
            <Link 
              to="/products" 
              className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCategories.map((category) => (
              <Link 
                key={category.slug} 
                to={`/products/category/${category.slug}`}
                className="group relative h-64 rounded-lg overflow-hidden shadow-md"
              >
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                  <p className="text-white/80 group-hover:text-white transition-colors mt-1 flex items-center">
                    Shop Now
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Featured Products</h2>
            <Link 
              to="/products" 
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <ProductGrid products={featuredProducts} loading={loading} error={error || undefined} />
        </div>
      </section>

      {/* Promotion Banner */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 md:p-12 shadow-md text-white">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Summer Sale</h2>
              <p className="text-lg md:text-xl mb-6">
                Enjoy up to 50% off on selected items. Limited time offer!
              </p>
              <Link 
                to="/products/sale" 
                className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
              >
                Shop the Sale
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">New Arrivals</h2>
            <Link 
              to="/products/new" 
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          {/* Using the same products for demonstration */}
          <ProductGrid products={featuredProducts.slice(4, 8)} loading={loading} error={error || undefined} />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
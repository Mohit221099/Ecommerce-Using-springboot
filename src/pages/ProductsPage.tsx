import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { Filter, Search, ArrowUpDown } from 'lucide-react';
import { Product } from '../types';
import { productAPI } from '../services/api';

// Mock data for development - same as in HomePage
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
  {
    id: 9,
    name: 'Digital Camera',
    description: 'Professional digital camera with 4K video recording.',
    price: 649.99,
    imageUrl: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Electronics',
    stock: 5
  },
  {
    id: 10,
    name: 'Running Shoes',
    description: 'Lightweight running shoes with cushioned soles.',
    price: 89.95,
    imageUrl: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Clothing',
    stock: 25
  },
  {
    id: 11,
    name: 'Science Fiction Collection',
    description: 'A collection of classic science fiction novels.',
    price: 49.99,
    imageUrl: 'https://images.pexels.com/photos/2927080/pexels-photo-2927080.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Books',
    stock: 10
  },
  {
    id: 12,
    name: 'Stand Mixer',
    description: 'Professional stand mixer for baking enthusiasts.',
    price: 299.99,
    imageUrl: 'https://images.pexels.com/photos/4194623/pexels-photo-4194623.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Home & Kitchen',
    stock: 7
  },
];

const categories = [
  'All',
  'Electronics',
  'Clothing',
  'Books',
  'Home & Kitchen',
];

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
];

const ProductsPage: React.FC = () => {
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Check if we're looking for a specific category from the URL
        const urlParams = new URLSearchParams(location.search);
        const categoryParam = location.pathname.includes('/category/') 
          ? location.pathname.split('/category/')[1]
          : null;
        const searchParam = urlParams.get('q');
        
        if (categoryParam) {
          setSelectedCategory(categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1));
        }
        
        if (searchParam) {
          setSearchQuery(searchParam);
        }

        // In a real application, we would fetch from the API
        // const response = await productAPI.getAll();
        // setProducts(response.data);
        
        // Using mock data for development
        setTimeout(() => {
          setProducts(mockProducts);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location]);

  useEffect(() => {
    // Apply filters and sorting
    let result = [...products];
    
    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        product => 
          product.name.toLowerCase().includes(query) || 
          product.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by price range
    result = result.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Apply sorting
    switch(sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // 'featured' - use default order
        break;
    }
    
    setFilteredProducts(result);
  }, [products, selectedCategory, searchQuery, sortBy, priceRange]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would update the URL in a real application
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = parseInt(e.target.value);
    setPriceRange(prev => {
      const newRange = [...prev] as [number, number];
      newRange[index] = value;
      return newRange;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            {selectedCategory === 'All' ? 'All Products' : selectedCategory}
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="py-2 pl-10 pr-4 w-full sm:w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>
            
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none py-2 pl-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ArrowUpDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center space-x-2 py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              <Filter size={20} />
              <span>Filters</span>
            </button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className={`w-full md:w-64 md:block ${showFilters ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category} className="flex items-center">
                    <input
                      type="radio"
                      id={`category-${category}`}
                      name="category"
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`category-${category}`} className="ml-2 text-gray-700">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="my-6 border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Price Range</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Min: ${priceRange[0]}</span>
                    <span className="text-sm text-gray-500">Max: ${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(e, 0)}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(e, 1)}
                    className="w-full"
                  />
                </div>
              </div>
              
              <button 
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setSortBy('featured');
                  setPriceRange([0, 1000]);
                  setShowFilters(false);
                }}
                className="w-full py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors mt-4"
              >
                Reset Filters
              </button>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="flex-1">
            <ProductGrid 
              products={filteredProducts} 
              loading={loading} 
              error={error || undefined} 
            />
            
            {!loading && filteredProducts.length === 0 && !error && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No products match your filters.</p>
                <button 
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                    setPriceRange([0, 1000]);
                  }}
                  className="py-2 px-6 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
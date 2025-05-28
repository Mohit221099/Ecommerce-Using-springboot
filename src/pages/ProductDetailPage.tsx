import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, ArrowLeft, Check, AlertTriangle, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductGrid from '../components/ProductGrid';
import { Product } from '../types';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';

// Mock data for development - prices in Indian Rupees (₹)
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and long battery life. Perfect for music lovers and professionals who need to focus. Features include: Active Noise Cancellation, 30-hour battery life, comfortable over-ear design, and high-fidelity sound.',
    price: 8299,
    imageUrl: 'https://images.pexels.com/photos/3394666/pexels-photo-3394666.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Electronics',
    stock: 15,
  },
  {
    id: '2',
    name: 'Casual T-Shirt',
    description: '100% cotton casual t-shirt, perfect for everyday wear. This comfortable t-shirt is made from high-quality fabric that\'s soft on your skin and durable for long-term wear. Available in multiple sizes and colors.',
    price: 2075,
    imageUrl: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Clothing',
    stock: 25,
  },
  {
    id: '3',
    name: 'Novel - The Great Journey',
    description: 'A bestselling novel about adventure and discovery. Follow the protagonist through a thrilling journey of self-discovery and adventure in exotic locations around the world. This page-turner has been praised by critics worldwide.',
    price: 1573,
    imageUrl: 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Books',
    stock: 30,
  },
  {
    id: '4',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe. This high-quality coffee maker allows you to program your brewing schedule up to 24 hours in advance. The thermal carafe keeps your coffee hot for hours without a heating plate.',
    price: 6636,
    imageUrl: 'https://images.pexels.com/photos/7474372/pexels-photo-7474372.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Home & Kitchen',
    stock: 10,
  },
];

// Mock frequently bought together products
const frequentlyBoughtTogether: Product[] = [
  {
    id: '5',
    name: 'Bluetooth Adapter',
    description: 'Compact Bluetooth adapter for wireless connectivity.',
    price: 1499,
    imageUrl: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Electronics',
    stock: 20,
  },
  {
    id: '6',
    name: 'Headphone Case',
    description: 'Protective case for headphones.',
    price: 999,
    imageUrl: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Electronics',
    stock: 30,
  },
];

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setTimeout(() => {
          const foundProduct = mockProducts.find((p) => p.id === id);
          if (foundProduct) {
            setProduct(foundProduct);
            const related = mockProducts
              .filter((p) => p.category === foundProduct.category && p.id !== foundProduct.id)
              .slice(0, 4);
            setRelatedProducts(related);
          } else {
            setError('Product not found.');
          }
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load product details. Please try again later.');
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && product && value <= product.stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleShare = () => {
    // Mock share action (e.g., copy link to clipboard)
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  // Calculate delivery date (3 days from May 28, 2025)
  const deliveryDate = new Date('2025-05-31').toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Parse description for features
  const features = product?.description.split('. ').filter((s) => s.includes('Features include:')).join('').replace('Features include: ', '').split(', ');

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-6 w-32 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="lg:col-span-1">
              <div className="h-8 w-3/4 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 w-1/4 bg-gray-200 rounded mb-6"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-8"></div>
            </div>
            <div className="lg:col-span-1">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen py-8 px-4 max-w-7xl mx-auto">
        <Link to="/products" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Products
        </Link>
        <div className="text-center py-12">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{error || 'Product not found'}</h1>
          <p className="text-gray-600 mb-6">The product you're looking for might have been removed or is temporarily unavailable.</p>
          <Link
            to="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <ol className="flex space-x-2">
            <li>
              <Link to="/" className="hover:text-blue-600">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link to={`/products/category/${product.category.toLowerCase()}`} className="hover:text-blue-600">
                {product.category}
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-800">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Image Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-auto object-contain aspect-square"
                  loading="lazy"
                />
                <div className="absolute inset-0 group-hover:bg-black/10 transition-colors" />
              </motion.div>
              {/* Thumbnail Gallery (Mocked with single image) */}
              <div className="flex justify-center mt-4 space-x-2">
                <img
                  src={product.imageUrl}
                  alt={`${product.name} thumbnail`}
                  className="w-16 h-16 object-cover rounded-md border border-gray-200 hover:border-blue-600 cursor-pointer"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h1 className="text-3xl font-bold text-gray-800 mb-3">{product.name}</h1>
              <div className="flex items-center mb-3">
                <div className="flex">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                  <Star className="h-5 w-5 text-gray-300" />
                </div>
                <Link to="#reviews" className="ml-2 text-sm text-blue-600 hover:underline">
                  (1,234 customer reviews)
                </Link>
              </div>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-blue-600">₹{product.price.toLocaleString('en-IN')}</span>
                <span className="text-sm text-gray-500 line-through ml-2">
                  ₹{(product.price * 1.1).toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-red-600 ml-2">(10% off)</span>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
                </span>
                <span className="text-sm text-gray-500">Category: {product.category}</span>
              </div>
              <p className="text-gray-700 mb-4">{product.description.split('. Features include:')[0]}.</p>
              {features && features.length > 0 && (
                <ul className="list-disc pl-5 mb-6 text-gray-700">
                  {features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              )}
              <div className="text-sm text-gray-600 mb-4">
                <p>
                  <span className="font-medium">FREE delivery</span> by {deliveryDate}.
                </p>
                <p>
                  Or fastest delivery by{' '}
                  {new Date('2025-05-30').toLocaleDateString('en-IN', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Buy Box */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
              <div className="text-xl font-bold text-blue-600 mb-4">₹{product.price.toLocaleString('en-IN')}</div>
              <div className="text-sm text-gray-600 mb-4">
                <p>
                  <span className="font-medium">FREE delivery</span> by {deliveryDate}.
                </p>
              </div>
              <div className="mb-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity:
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-600 focus:border-blue-600"
                  disabled={product.stock === 0}
                >
                  {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <motion.button
                onClick={handleAddToCart}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-md font-medium transition-colors mb-3 ${
                  addedToCart
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                }`}
                disabled={product.stock === 0}
                whileTap={{ scale: 0.95 }}
              >
                {addedToCart ? (
                  <>
                    <Check className="h-5 w-5" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </motion.button>
              <motion.button
                className="w-full flex items-center justify-center space-x-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors mb-3"
                whileTap={{ scale: 0.95 }}
              >
                <span>Buy Now</span>
              </motion.button>
              <motion.button
                onClick={toggleWishlist}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-6 border border-gray-300 rounded-md font-medium transition-colors mb-3 ${
                  isWishlisted ? 'text-red-600 border-red-300' : 'text-gray-700'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-600' : ''}`} />
                <span>{isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
              </motion.button>
              <motion.button
                onClick={handleShare}
                className="w-full flex items-center justify-center space-x-2 py-3 px-6 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Frequently Bought Together */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Bought Together</h2>
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white rounded-lg p-6 shadow-sm">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-24 h-24 object-cover rounded-md"
              loading="lazy"
            />
            <span className="text-gray-600">+</span>
            {frequentlyBoughtTogether.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-md"
                  loading="lazy"
                />
                <span className="text-gray-600">+</span>
              </div>
            ))}
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Total: ₹{(product.price + frequentlyBoughtTogether.reduce((sum, item) => sum + item.price, 0)).toLocaleString('en-IN')}
              </p>
              <motion.button
                onClick={() => {
                  addToCart(product, quantity);
                  frequentlyBoughtTogether.forEach((item) => addToCart(item, 1));
                  setAddedToCart(true);
                  setTimeout(() => setAddedToCart(false), 3000);
                }}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-2 rounded-md font-medium transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                Add All to Cart
              </motion.button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, ArrowLeft, Check, AlertTriangle } from 'lucide-react';
import { Product } from '../types';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductGrid from '../components/ProductGrid';

// Mock data for development - same as in HomePage
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and long battery life. Perfect for music lovers and professionals who need to focus. Features include: Active Noise Cancellation, 30-hour battery life, comfortable over-ear design, and high-fidelity sound.',
    price: 99.99,
    imageUrl: 'https://images.pexels.com/photos/3394666/pexels-photo-3394666.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Electronics',
    stock: 15
  },
  {
    id: 2,
    name: 'Casual T-Shirt',
    description: '100% cotton casual t-shirt, perfect for everyday wear. This comfortable t-shirt is made from high-quality fabric that\'s soft on your skin and durable for long-term wear. Available in multiple sizes and colors.',
    price: 24.99,
    imageUrl: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Clothing',
    stock: 25
  },
  {
    id: 3,
    name: 'Novel - The Great Journey',
    description: 'A bestselling novel about adventure and discovery. Follow the protagonist through a thrilling journey of self-discovery and adventure in exotic locations around the world. This page-turner has been praised by critics worldwide.',
    price: 18.95,
    imageUrl: 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Books',
    stock: 30
  },
  {
    id: 4,
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe. This high-quality coffee maker allows you to program your brewing schedule up to 24 hours in advance. The thermal carafe keeps your coffee hot for hours without a heating plate.',
    price: 79.95,
    imageUrl: 'https://images.pexels.com/photos/7474372/pexels-photo-7474372.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Home & Kitchen',
    stock: 10
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
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // In a real application, we would fetch from the API
        // const response = await productAPI.getById(parseInt(id!, 10));
        // setProduct(response.data);
        
        // Using mock data for development
        setTimeout(() => {
          const foundProduct = mockProducts.find(p => p.id === parseInt(id!, 10));
          if (foundProduct) {
            setProduct(foundProduct);
            
            // Get related products from the same category
            const related = mockProducts
              .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
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

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && product && value <= product.stock) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-6 w-32 bg-gray-300 rounded mb-8"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2 h-96 bg-gray-300 rounded"></div>
            <div className="w-full md:w-1/2">
              <div className="h-8 w-3/4 bg-gray-300 rounded mb-4"></div>
              <div className="h-6 w-1/4 bg-gray-300 rounded mb-6"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-gray-300 rounded mb-8"></div>
              <div className="h-12 bg-gray-300 rounded mb-4"></div>
              <div className="h-12 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen py-8 px-4 max-w-6xl mx-auto">
        <Link to="/products" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Products
        </Link>
        <div className="text-center py-12">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {error || 'Product not found'}
          </h1>
          <p className="text-gray-600 mb-6">
            The product you're looking for might have been removed or is temporarily unavailable.
          </p>
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
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Link to="/products" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Products
        </Link>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-auto object-contain object-center aspect-square"
              />
            </div>
          </div>
          
          {/* Product Details */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {product.name}
              </h1>
              
              <div className="text-xl font-semibold text-blue-600 mb-4">
                ${product.price.toFixed(2)}
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
                <span className="text-sm text-gray-500">
                  Category: {product.category}
                </span>
              </div>
              
              <p className="text-gray-700 mb-6">
                {product.description}
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity:
                </label>
                <div className="flex w-1/3">
                  <button 
                    onClick={decrementQuantity}
                    className="px-4 py-2 bg-gray-200 rounded-l-lg"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="flex-1 text-center border-t border-b border-gray-300"
                  />
                  <button 
                    onClick={incrementQuantity}
                    className="px-4 py-2 bg-gray-200 rounded-r-lg"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-md font-medium transition-colors ${
                    addedToCart 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                  disabled={product.stock === 0}
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
                </button>
                
                <button className="flex items-center justify-center space-x-2 py-3 px-6 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
                  <Heart className="h-5 w-5" />
                  <span className="sm:hidden md:inline">Add to Wishlist</span>
                </button>
              </div>
              
              <div className="flex items-center justify-end mt-6">
                <button className="flex items-center text-gray-500 hover:text-gray-700">
                  <Share2 className="h-5 w-5 mr-2" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
import React, { useState, useEffect } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductGrid from '../components/ProductGrid';
import { Product } from '../types';
import { productAPI } from '../services/api';

// Featured categories
const featuredCategories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Clothing',
    slug: 'clothing',
    image: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Books',
    slug: 'books',
    image: 'https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    name: 'Home & Kitchen',
    slug: 'home',
    image: 'https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

// Hero banners
const heroBanners = [
  {
    title: 'Summer Sale Extravaganza',
    subtitle: 'Up to 50% off on all products!',
    image: 'https://images.pexels.com/photos/5632371/pexels-photo-5632371.jpeg?auto=compress&cs=tinysrgb&w=1600',
    cta: 'Shop Now',
    link: '/products',
  },
  {
    title: 'New Arrivals',
    subtitle: 'Discover the latest trends in fashion and tech.',
    image: 'https://images.pexels.com/photos/298842/pexels-photo-298842.jpeg?auto=compress&cs=tinysrgb&w=1600',
    cta: 'Explore Now',
    link: '/products',
  },
  {
    title: 'Tech Deals',
    subtitle: 'Grab the latest gadgets at unbeatable prices.',
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1600',
    cta: 'Shop Tech',
    link: '/products',
  },
];

// Mock products
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation.',
    price: 8299,
    imageUrl: 'https://images.pexels.com/photos/3394666/pexels-photo-3394666.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Electronics',
    stock: 15,
  },
  {
    id: '2',
    name: 'Casual T-Shirt',
    description: '100% cotton casual t-shirt for everyday wear.',
    price: 2075,
    imageUrl: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Clothing',
    stock: 50,
  },
  {
    id: '3',
    name: 'Novel - The Great Journey',
    description: 'A bestselling novel about adventure and discovery.',
    price: 1573,
    imageUrl: 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Books',
    stock: 30,
  },
  {
    id: '4',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe.',
    price: 6636,
    imageUrl: 'https://images.pexels.com/photos/7474372/pexels-photo-7474372.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Home & Kitchen',
    stock: 10,
  },
  {
    id: '5',
    name: 'Smartphone',
    description: 'Latest model smartphone with high-resolution camera.',
    price: 66399,
    imageUrl: 'https://images.pexels.com/photos/1447254/pexels-photo-1447254.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Electronics',
    stock: 8,
  },
  {
    id: '6',
    name: 'Winter Jacket',
    description: 'Warm winter jacket with water-resistant shell.',
    price: 12449,
    imageUrl: 'https://images.pexels.com/photos/8364025/pexels-photo-8364025.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Clothing',
    stock: 20,
  },
  {
    id: '7',
    name: 'Cooking Basics Cookbook',
    description: 'Learn cooking basics with this illustrated cookbook.',
    price: 2901,
    imageUrl: 'https://images.pexels.com/photos/4144234/pexels-photo-4144234.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Books',
    stock: 15,
  },
  {
    id: '8',
    name: 'Blender',
    description: 'Powerful blender for smoothies and food processing.',
    price: 5809,
    imageUrl: 'https://images.pexels.com/photos/1714422/pexels-photo-1714422.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Home & Kitchen',
    stock: 12,
  },
];

// Testimonials
const testimonials = [
  {
    name: 'Priya Sharma',
    review: 'Amazing quality products and super fast delivery! My new headphones are fantastic.',
    rating: 5,
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Rahul Verma',
    review: 'The clothing collection is stylish and affordable. Highly recommend this store!',
    rating: 4,
    image: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Anita Desai',
    review: 'Loved the coffee maker. Easy to use and great customer support.',
    rating: 5,
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Fetch products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setTimeout(() => {
          setFeaturedProducts(mockProducts);
          setLoading(false);
        }, 500);
        // Real API: const response = await productAPI.getAll();
        // setFeaturedProducts(response.data);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  // Auto-rotate hero banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const endDate = new Date('2025-05-31T23:59:59');
    const updateTimer = () => {
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft('Sale Ended');
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Hero Carousel */}
      <section className="relative h-[600px] overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentBanner}
            className="absolute inset-0"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.7 }}
          >
            <img
              src={heroBanners[currentBanner].image}
              alt={heroBanners[currentBanner].title}
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-start max-w-7xl mx-auto px-4">
              <div className="text-left text-white">
                <motion.h1
                  className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {heroBanners[currentBanner].title}
                </motion.h1>
                <motion.p
                  className="text-xl md:text-3xl mb-6 max-w-lg"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {heroBanners[currentBanner].subtitle}
                </motion.p>
                <Link
                  to={heroBanners[currentBanner].link}
                  className="inline-flex items-center bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-500 transition-colors shadow-lg"
                  aria-label={`Shop ${heroBanners[currentBanner].title}`}
                >
                  {heroBanners[currentBanner].cta}
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        {/* Carousel Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {heroBanners.map((_, index) => (
            <button
              key={index}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                index === currentBanner ? 'bg-yellow-400 scale-125' : 'bg-white/70'
              }`}
              onClick={() => setCurrentBanner(index)}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCategories.map((category) => (
              <motion.div
                key={category.slug}
                className="relative h-72 rounded-2xl overflow-hidden shadow-md group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Link to={`/products/category/${category.slug}`} aria-label={`Shop ${category.name}`}>
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                    <p className="text-white/90 group-hover:text-yellow-400 flex items-center text-base font-medium transition-colors">
                      Explore Now
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-extrabold text-gray-900">Featured Products</h2>
            <Link
              to="/products"
              className="text-blue-600 hover:text-blue-800 font-semibold text-lg flex items-center"
              aria-label="View all products"
            >
              View All
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <ProductGrid products={featuredProducts.slice(0, 4)} loading={loading} error={error || undefined} />
        </div>
      </section>

      {/* Promotional Banner with Countdown */}
      <section className="py-20 bg-gradient-to-r from-blue-700 to-indigo-900 text-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-5xl font-extrabold mb-6">Summer Sale - Don’t Miss Out!</h2>
            <p className="text-2xl mb-8">Up to 50% off on thousands of items. Shop now before time runs out!</p>
            <motion.div
              className="text-3xl font-bold mb-8 bg-white/10 px-8 py-3 rounded-lg inline-block"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {timeLeft}
            </motion.div>
            <Link
              to="/products/sale"
              className="inline-flex items-center bg-yellow-400 text-gray-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-500 transition-colors shadow-lg"
              aria-label="Shop the Summer Sale"
            >
              Shop the Sale
              <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-extrabold text-gray-900">New Arrivals</h2>
            <Link
              to="/products/new"
              className="text-blue-600 hover:text-blue-800 font-semibold text-lg flex items-center"
              aria-label="View all new arrivals"
            >
              View All
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <ProductGrid products={featuredProducts.slice(4, 8)} loading={loading} error={error || undefined} />
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">What Our Customers Say</h2>
          <div className="relative">
            <AnimatePresence initial={false}>
              <motion.div
                key={currentTestimonial}
                className="bg-white rounded-xl p-8 shadow-lg max-w-md mx-auto"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    className="h-16 w-16 rounded-full object-cover mr-4"
                    loading="lazy"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">{testimonials[currentTestimonial].name}</h4>
                    <div className="flex">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-base">{testimonials[currentTestimonial].review}</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-center mt-6 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`h-3 w-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-yellow-400 scale-125' : 'bg-gray-400'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
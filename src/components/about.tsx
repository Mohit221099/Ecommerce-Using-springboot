import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Placeholder image URLs (replace with actual high-quality images)
const sliderImages = [
  {
    url: 'https://images.unsplash.com/photo-1556740714-7c4a6b8c6f9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    caption: 'Empower Your Business with SimpleShop',
    subCaption: 'Create stunning online stores with ease.',
  },
  {
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    caption: 'Seamless Shopping Experience',
    subCaption: 'Designed for your customers’ delight.',
  },
  {
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    caption: 'Join Our Community',
    subCaption: 'Powering small businesses worldwide.',
  },
];

const About: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section with Slider */}
      <section className="relative h-[60vh] overflow-hidden">
        {sliderImages.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${slide.url})` }}
          >
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative flex items-center justify-center h-full text-center text-white px-4">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.caption}</h1>
                <p className="text-lg md:text-xl max-w-2xl mx-auto">{slide.subCaption}</p>
              </div>
            </div>
          </div>
        ))}
        {/* Slider Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-all"
        >
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-all"
        >
          <ChevronRight size={24} className="text-gray-800" />
        </button>
        {/* Slider Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 w-3 rounded-full ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            ></button>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At SimpleShop, we believe that every business deserves a stunning online presence without the complexity. Our mission is to provide an intuitive ecommerce platform that allows anyone—regardless of technical expertise—to create a beautiful online store that drives sales and showcases their brand.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Founded in 2020, SimpleShop has grown to power hundreds of unique stores worldwide, offering customizable themes and seamless integrations with platforms like Facebook, Instagram, and Google Shopping.
            </p>
          </div>
          <div className="md:w-1/2">
            <img
              src={sliderImages[2].url}
              alt="SimpleShop team working together"
              className="rounded-lg shadow-md w-full object-cover h-96"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Simplicity</h3>
              <p className="text-gray-700">
                We design our platform to be user-friendly, allowing you to focus on growing your business, not wrestling with code.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Beauty</h3>
              <p className="text-gray-700">
                Our professionally designed themes ensure your store looks stunning on any device, captivating your customers.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Empowerment</h3>
              <p className="text-gray-700">
                We empower small businesses with tools to compete with industry giants, leveling the playing field.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the SimpleShop Community</h2>
          <p className="text-lg max-w-xl mx-auto mb-8">
            Start your free 14-day trial and discover how SimpleShop can transform your business with a beautiful, high-converting online store.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-white text-blue-600 font-semibold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer Links */}
      <section className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
              Contact Us
            </Link>
            <Link to="/products" className="text-gray-300 hover:text-white transition-colors">
              Explore Our Features
            </Link>
            <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">
              Read Our Blog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
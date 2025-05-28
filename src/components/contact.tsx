import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, AlertCircle } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError(null);
    setLoading(true);

    // Mock form submission
    setTimeout(() => {
      setSuccess('Your message has been sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/">
            <img
              src="https://via.placeholder.com/150x50?text=SimpleShop"
              alt="SimpleShop Logo"
              className="h-10"
            />
          </Link>
          <nav className="space-x-4">
            <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium">
              Home
            </Link>
            <Link to="/shop" className="text-gray-600 hover:text-indigo-600 font-medium">
              Shop
            </Link>
            <Link to="/contact" className="text-indigo-600 font-medium">
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
          <p className="mt-2 text-gray-600 text-lg">
            Have questions or feedback? Reach out to our team, and we’ll get back to you promptly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send Us a Message</h2>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-lg flex items-start">
                <Send className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{success}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400"
                  placeholder="Your email"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400"
                  placeholder="Subject"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400"
                  placeholder="Your message"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white ${
                  loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                } transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-indigo-600 mr-3 mt-1" />
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Email</h3>
                  <p className="text-gray-600">support@simpleshop.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-6 w-6 text-indigo-600 mr-3 mt-1" />
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Phone</h3>
                  <p className="text-gray-600">+91 123-456-7890</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-indigo-600 mr-3 mt-1" />
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Address</h3>
                  <p className="text-gray-600">123 SimpleShop Lane, Tech City, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Developer Credits */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
            Meet Our Developers
          </h2>
          {/* Group Photo */}
          <div className="max-w-3xl mx-auto mb-8">
            <img
              src="src\components\assets\WhatsApp Image 2025-05-28 at 15.24.22_8888d79d.jpg"
              alt="SimpleShop Development Team"
              className="w-full h-auto rounded-xl shadow-lg object-cover"
            />
            <p className="text-center text-gray-600 text-sm mt-4">
              Our Development Team: Bidya Bharti, Suman Anand, Aman, and Snihendu
            </p>
          </div>
          {/* Developer Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Bidya Bharti',
                role: 'Full-Stack Developer',
                bio: 'Bidya specializes in crafting robust backend systems and seamless user interfaces, ensuring SimpleShop runs smoothly.',
                linkedin: '#',
              },
              {
                name: 'Suman Anand',
                role: 'Frontend Developer',
                bio: 'Suman brings SimpleShop’s UI to life with pixel-perfect designs and responsive layouts.',
                linkedin: '#',
              },
              {
                name: 'Aman',
                role: 'Backend Developer',
                bio: 'Aman architects secure APIs and databases, powering SimpleShop’s core functionality.',
                linkedin: '#',
              },
              {
                name: 'Snihendu',
                role: 'DevOps Engineer',
                bio: 'Snihendu ensures SimpleShop’s infrastructure is reliable, scalable, and always online.',
                linkedin: '#',
              },
            ].map((dev) => (
              <div key={dev.name} className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-2xl font-bold">
                  {dev.name[0]}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{dev.name}</h3>
                <p className="text-sm text-indigo-600 mb-2">{dev.role}</p>
                <p className="text-sm text-gray-600 mb-4">{dev.bio}</p>
                <a
                  href={dev.linkedin}
                  className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Connect on LinkedIn
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            © 2025 SimpleShop. Developed and maintained by Bidya Bharti, Suman Anand, Aman, and Snihendu.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;
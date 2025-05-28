import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Trash2, CreditCard, CheckCircle, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { debounce } from 'lodash';
import { Product, Order } from '../types';

const UPI_IMAGES = {
  PhonePe: 'https://cdn.iconscout.com/icon/free/png-256/phonepe-3-675741.png',
  GooglePay: 'https://cdn.iconscout.com/icon/free/png-256/google-pay-2038778-1721671.png',
  Paytm: 'https://cdn.iconscout.com/icon/free/png-256/paytm-226448.png',
  UPI: 'https://cdn.iconscout.com/icon/free/png-256/upi-2085064-1747958.png',
};

interface CartItemType {
  product: Product;
  quantity: number;
}

const checkPincodeAvailability = async (pincode: string): Promise<boolean> => {
  try {
    return await new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const availablePincodes = ['400001', '500032', '700001', '600034', '110001'];
        resolve(availablePincodes.includes(pincode));
      }, 500);
    });
  } catch (error) {
    console.error('Pincode check failed:', error);
    return false;
  }
};

const CartPage: React.FC = () => {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [isCheckout, setIsCheckout] = useState(false);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [address, setAddress] = useState({
    fullName: '',
    streetAddress: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });
  const [pincodeError, setPincodeError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'PhonePe' | 'GooglePay' | 'Paytm' | 'COD' | null>(null);
  const [upiId, setUpiId] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [newOrder, setNewOrder] = useState<Order | null>(null);

  const checkPincodeDebounced = debounce(async (pincode: string, setError: (error: string) => void) => {
    if (pincode.length === 6) {
      const isAvailable = await checkPincodeAvailability(pincode);
      setError(isAvailable ? '' : 'Delivery is not available for this pincode.');
    } else {
      setError('');
    }
  }, 500);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
    if (name === 'pincode') {
      checkPincodeDebounced(value, setPincodeError);
    }
  };

  const handleUpiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpiId(e.target.value);
  };

  const handlePayment = () => {
    if (!paymentMethod) {
      alert('Please select a payment method.');
      return;
    }

    if (['UPI', 'PhonePe', 'GooglePay', 'Paytm'].includes(paymentMethod) && !upiId.match(/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/)) {
      alert('Please enter a valid UPI ID (e.g., user@bank).');
      return;
    }

    setIsPaymentModalOpen(true);

    setTimeout(() => {
      setIsPaymentModalOpen(false);
      setIsPaymentSuccessful(true);

      const orderDate = new Date();
      const estimatedDelivery = new Date(orderDate);
      estimatedDelivery.setDate(orderDate.getDate() + 5);

      const orderItems: Array<{ product: Product; quantity: number }> = items.map((item) => ({
        product: { ...item.product },
        quantity: item.quantity,
      }));

      const order: Order = {
        id: Date.now(),
        items: orderItems,
        total: totalPrice + 500 + totalPrice * 0.1,
        address: { ...address },
        status: 'PENDING',
        orderDate: orderDate.toISOString(),
        estimatedDeliveryDate: estimatedDelivery.toISOString(),
        userId: 0,
        createdAt: orderDate.toISOString(),
        paymentMethod,
      };

      try {
        const storedOrders = localStorage.getItem('orders');
        const orders: Order[] = storedOrders ? JSON.parse(storedOrders) : [];
        if (!Array.isArray(orders)) {
          localStorage.setItem('orders', JSON.stringify([order]));
        } else {
          localStorage.setItem('orders', JSON.stringify([...orders, order]));
        }
      } catch (error) {
        console.error('Failed to save order:', error);
      }

      setNewOrder(order);

      setTimeout(() => {
        setIsPaymentSuccessful(false);
        setIsOrderConfirmed(true);
        clearCart();
      }, 1500);
    }, paymentMethod === 'COD' ? 1000 : 2000);
  };

  const handleProceedToPayment = () => {
    const { fullName, streetAddress, city, state, pincode, phone } = address;
    if (!fullName || !streetAddress || !city || !state || !pincode || !phone) {
      alert('Please fill in all address fields.');
      return;
    }
    if (pincode.length !== 6 || pincodeError) {
      alert('Please enter a valid pincode.');
      return;
    }
    if (!paymentMethod) {
      alert('Please select a payment method.');
      return;
    }
    handlePayment();
  };

  const handleNewOrder = () => {
    if (!newOrder) {
      console.error('No order to process');
      return;
    }
    setIsCheckout(false);
    setIsOrderConfirmed(false);
    setAddress({ fullName: '', streetAddress: '', city: '', state: '', pincode: '', phone: '' });
    setPincodeError('');
    setPaymentMethod(null);
    setUpiId('');
    setNewOrder(null);
    navigate('/orders', { state: { newOrder } });
  };

  if (items.length === 0 && !isOrderConfirmed) {
    return (
      <div className="min-h-screen py-12 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Looks like you haven't added any products yet.</p>
          <Link
            to="/products"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
            aria-label="Continue Shopping"
          >
            Continue Shopping
            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    );
  }

  if (isOrderConfirmed) {
    return (
      <div className="min-h-screen py-12 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" aria-hidden="true" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been placed successfully.</p>
          <button
            onClick={handleNewOrder}
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
            aria-label="View My Orders"
          >
            View My Orders
            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }

  if (isCheckout) {
    return (
      <div className="min-h-screen py-8 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Checkout</h1>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-grow">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1" htmlFor="fullName">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={address.fullName}
                      onChange={handleAddressChange}
                      className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="John Doe"
                      aria-label="Full Name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1" htmlFor="phone">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={address.phone}
                      onChange={handleAddressChange}
                      className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="123-456-7890"
                      aria-label="Phone Number"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-1" htmlFor="streetAddress">
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="streetAddress"
                      name="streetAddress"
                      value={address.streetAddress}
                      onChange={handleAddressChange}
                      className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="123 Main St"
                      aria-label="Street Address"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1" htmlFor="city">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Mumbai"
                      aria-label="City"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1" htmlFor="state">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                      className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Maharashtra"
                      aria-label="State"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1" htmlFor="pincode">
                      Pincode
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={address.pincode}
                      onChange={handleAddressChange}
                      className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 ${
                        pincodeError ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                      }`}
                      placeholder="400001"
                      maxLength={6}
                      aria-label="Pincode"
                    />
                    {pincodeError && <p className="text-red-500 text-sm mt-1">{pincodeError}</p>}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>
                <div className="space-y-4">
                  {[
                    { id: 'PhonePe', label: 'PhonePe', image: UPI_IMAGES.PhonePe },
                    { id: 'GooglePay', label: 'Google Pay', image: UPI_IMAGES.GooglePay },
                    { id: 'Paytm', label: 'Paytm', image: UPI_IMAGES.Paytm },
                    { id: 'UPI', label: 'Other UPI', image: UPI_IMAGES.UPI },
                    { id: 'COD', label: 'Cash on Delivery', image: null },
                  ].map((method) => (
                    <motion.div
                      key={method.id}
                      className="flex items-center"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <input
                        type="radio"
                        id={method.id}
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id as 'UPI' | 'PhonePe' | 'GooglePay' | 'Paytm' | 'COD')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        aria-label={`Pay with ${method.label}`}
                      />
                      <label
                        htmlFor={method.id}
                        className="ml-2 flex items-center text-gray-700 cursor-pointer hover:bg-gray-50 p-2 rounded-md w-full transition-colors"
                      >
                        {method.image ? (
                          <img src={method.image} alt={`${method.label} logo`} className="h-8 w-8 mr-2" />
                        ) : (
                          <Package className="h-8 w-8 mr-2 text-gray-600" aria-hidden="true" />
                        )}
                        {method.label}
                      </label>
                    </motion.div>
                  ))}
                  {['UPI', 'PhonePe', 'GooglePay', 'Paytm'].includes(paymentMethod || '') && (
                    <div className="ml-6">
                      <label className="block text-gray-700 mb-1" htmlFor="upiId">
                        UPI ID
                      </label>
                      <input
                        type="text"
                        id="upiId"
                        value={upiId}
                        onChange={handleUpiChange}
                        className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="user@bank"
                        aria-label="UPI ID"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full lg:w-80">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-800 font-medium">₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-800 font-medium">₹500.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="text-gray-800 font-medium">₹{(totalPrice * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-800">Total</span>
                      <span className="text-lg font-bold text-blue-600">
                        ₹{(totalPrice + 500 + totalPrice * 0.1).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleProceedToPayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium transition-colors"
                  aria-label="Pay Now"
                >
                  Pay Now
                </button>
                <button
                  onClick={() => setIsCheckout(false)}
                  className="w-full text-blue-600 hover:text-blue-800 py-3 mt-3 font-medium transition-colors"
                  aria-label="Back to Cart"
                >
                  Back to Cart
                </button>
              </div>
            </div>
          </div>
          <AnimatePresence>
            {isPaymentModalOpen && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl"
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Payment Processing"
                >
                  {paymentMethod === 'COD' ? (
                    <div>
                      <div className="flex items-center justify-center mb-4">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Package className="h-10 w-10 text-blue-600 mr-2" aria-hidden="true" />
                        </motion.div>
                        <h2 className="text-xl font-bold text-gray-800">Confirming COD</h2>
                      </div>
                      <p className="text-gray-600 text-center mb-4">
                        Preparing your order for delivery to {address.fullName}, {address.city}.
                      </p>
                      <motion.div
                        className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.8 }}
                      >
                        <div className="h-full bg-blue-600" />
                      </motion.div>
                      <p className="text-xs text-gray-500 text-center mt-3">SimpleShop Secure Checkout</p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-center mb-4">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <CreditCard className="h-10 w-10 text-blue-600 mr-2" aria-hidden="true" />
                        </motion.div>
                        <h2 className="text-xl font-bold text-gray-800">Processing Payment</h2>
                      </div>
                      <p className="text-gray-600 text-center mb-4">
                        Paying ₹{(totalPrice + 500 + totalPrice * 0.1).toFixed(2)} via {paymentMethod}.
                      </p>
                      <motion.div
                        className="flex justify-center mb-4"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                      >
                        <svg className="h-16 w-16 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <motion.circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="2"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.8, ease: 'easeInOut' }}
                          />
                        </svg>
                      </motion.div>
                      <p className="text-xs text-gray-500 text-center mt-3">Powered by Razorpay</p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {isPaymentSuccessful && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl"
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Payment Successful"
                >
                  <div>
                    <motion.div
                      className="flex items-center justify-center mb-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                    >
                      <CheckCircle className="h-12 w-12 text-green-500 mr-2" aria-hidden="true" />
                      <h2 className="text-xl font-bold text-gray-800">Payment Successful!</h2>
                    </motion.div>
                    <motion.p
                      className="text-gray-600 text-center mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {paymentMethod === 'COD' ? 'Your COD order is confirmed!' : 'Thank you for your payment!'}
                    </motion.p>
                    <motion.div
                      className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.8 }}
                    >
                      <div className="h-full bg-green-500" />
                    </motion.div>
                    <p className="text-xs text-gray-500 text-center mt-3">SimpleShop Secure Checkout</p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Your Shopping Cart</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-grow">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Items ({totalItems})</h2>
                <button
                  onClick={clearCart}
                  className="flex items-center text-red-500 hover:text-red-700 transition-colors"
                  aria-label="Clear Cart"
                >
                  <Trash2 className="h-5 w-5 mr-1" aria-hidden="true" />
                  Clear Cart
                </button>
              </div>
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-80">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800 font-medium">₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-800 font-medium">₹500.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="text-gray-800 font-medium">₹{(totalPrice * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-800">Total</span>
                    <span className="text-lg font-bold text-blue-600">
                      ₹{(totalPrice + 500 + totalPrice * 0.1).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsCheckout(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium transition-colors"
                aria-label="Proceed to Checkout"
              >
                Proceed to Checkout
              </button>
              <Link
                to="/products"
                className="w-full block text-center text-blue-600 hover:text-blue-800 py-3 mt-3 font-medium transition-colors"
                aria-label="Continue Shopping"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

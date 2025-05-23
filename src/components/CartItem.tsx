import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartItem as CartItemType } from '../types';
import { useCart } from '../context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  const handleIncrement = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeFromCart(product.id);
    }
  };

  const handleRemove = () => {
    removeFromCart(product.id);
  };

  return (
    <div className="flex items-center py-4 border-b border-gray-200">
      <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover object-center"
        />
      </div>
      
      <div className="ml-4 flex-grow">
        <h3 className="text-base font-medium text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.category}</p>
        <div className="mt-1 text-blue-600 font-medium">${product.price.toFixed(2)}</div>
      </div>
      
      <div className="flex items-center ml-4">
        <button 
          onClick={handleDecrement}
          className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <Minus size={16} />
        </button>
        <span className="mx-2 w-8 text-center text-gray-700">{quantity}</span>
        <button 
          onClick={handleIncrement}
          className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <Plus size={16} />
        </button>
      </div>
      
      <div className="ml-4 w-20 text-right font-medium text-gray-800">
        ${(product.price * quantity).toFixed(2)}
      </div>
      
      <button 
        onClick={handleRemove}
        className="ml-4 p-1 text-gray-400 hover:text-red-500 focus:outline-none transition-colors"
        aria-label="Remove item"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default CartItem;
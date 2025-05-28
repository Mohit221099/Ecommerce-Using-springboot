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
<div className="flex items-center gap-4 p-4 border-b border-gray-200 bg-white shadow-sm rounded-lg mb-4">
<div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
<img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover object-center" />
</div>


  <div className="flex-grow">
    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
    <p className="text-sm text-gray-500">{product.category}</p>
    <p className="text-blue-600 font-medium mt-1 text-sm">
      ₹{product.price.toFixed(2)}
    </p>
  </div>

  <div className="flex items-center border rounded-md">
    <button
      onClick={handleDecrement}
      className="p-2 text-gray-600 hover:bg-gray-100"
    >
      <Minus size={16} />
    </button>
    <span className="px-4 text-gray-800 font-medium">{quantity}</span>
    <button
      onClick={handleIncrement}
      className="p-2 text-gray-600 hover:bg-gray-100"
    >
      <Plus size={16} />
    </button>
  </div>

  <div className="w-24 text-right text-gray-800 font-semibold">
    ₹{(product.price * quantity).toFixed(2)}
  </div>

  <button
    onClick={handleRemove}
    className="p-2 text-red-500 hover:text-red-700"
    aria-label="Remove item"
  >
    <Trash2 size={18} />
  </button>
</div>
);
};

export default CartItem;
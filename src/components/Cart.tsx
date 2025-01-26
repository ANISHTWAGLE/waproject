import React, { useState } from 'react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { CartItem } from '../types';
import { DateTime } from 'luxon';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
}

export function Cart({ items, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            items: items,
            total: total,
          },
        ]);

      if (error) throw error;

      toast.success('Order placed successfully!');
      onCheckout();
    } catch (error: any) {
      toast.error('Failed to place order');
      console.error('Checkout error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Shopping Cart</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="font-medium">{item.name}</span>
              <span className="text-gray-600">₹{item.price.toFixed(2)}</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                  className="text-gray-500 hover:text-gray-700"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Total:</span>
          <span className="font-semibold">₹{total.toFixed(2)}</span>
        </div>
        <button
          onClick={handleCheckout}
          disabled={isProcessing}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : 'Checkout'}
        </button>
      </div>
    </div>
  );
}
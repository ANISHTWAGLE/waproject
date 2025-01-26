import React from 'react';
import { Coffee, Bean as Tea, Droplet } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const getIcon = () => {
    switch (product.name.toLowerCase()) {
      case 'coffee':
        return <Coffee className="w-8 h-8" />;
      case 'tea':
        return <Tea className="w-8 h-8" />;
      case 'water':
        return <Droplet className="w-8 h-8" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
      <div className="mb-4 text-blue-500">{getIcon()}</div>
      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-4">₹{product.price.toFixed(2)}</p>
      <button
        onClick={() => onAddToCart(product)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Add to Cart
      </button>
    </div>
  );
}
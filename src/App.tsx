import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import { AuthForm } from './components/AuthForm';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { OrderHistory } from './components/OrderHistory';
import { EmbeddedVideo } from './components/EmbeddedVideo'; // Updated import
import { Product, CartItem, Order } from './types';
import { LogOut, ShoppingBag, Package } from 'lucide-react';

const products: Product[] = [
  { id: 1, name: 'Coffee', price: 299, image: '' },
  { id: 2, name: 'Tea', price: 199, image: '' },
  { id: 3, name: 'Water', price: 99, image: '' },
];

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showOrders, setShowOrders] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchOrders();
    }
  }, [session]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleAddToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCartItems((prevItems) =>
      quantity === 0
        ? prevItems.filter((item) => item.id !== id)
        : prevItems.map((item) =>
            item.id === id ? { ...item, quantity } : item
          )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleCheckout = async () => {
    setCartItems([]);
    await fetchOrders();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <EmbeddedVideo /> {/* Embedded video here */}
        <AuthForm onSuccess={() => {}} />
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <EmbeddedVideo /> {/* Embedded video here */}
      <div className="relative">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Beverage Shop</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowOrders(!showOrders)}
                className="flex items-center space-x-2 text-white hover:text-gray-200"
              >
                {showOrders ? (
                  <>
                    <ShoppingBag size={20} />
                    <span>Shop</span>
                  </>
                ) : (
                  <>
                    <Package size={20} />
                    <span>Orders</span>
                  </>
                )}
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-white hover:text-gray-200"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {showOrders ? (
            <OrderHistory orders={orders} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </div>
              <div>
                <Cart
                  items={cartItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onCheckout={handleCheckout}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

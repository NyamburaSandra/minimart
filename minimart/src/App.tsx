
import './App.css';
import React, { useState } from 'react';
import AuthForm from './pages/Auth/AuthForm';
import Shop from './pages/Shop/Shop';
import Cart from './pages/Shop/Cart';
import Checkout from './pages/Checkout/Checkout';
import AdminPanel from './pages/Admin/AdminPanel';

// Types
type User = { email: string; isAdmin?: boolean };
type CartItem = { id: number; name: string; price: number; image: string; quantity: number };
type Order = { id: number; email: string; phone: string; items: { name: string; quantity: number }[] };

// Simple navigation bar (moved outside App)
type NavProps = {
  user: User | null;
  cartCount: number;
  setPage: React.Dispatch<React.SetStateAction<'auth' | 'shop' | 'cart' | 'checkout' | 'admin'>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};
const Nav: React.FC<NavProps> = ({ user, cartCount, setPage, setUser }) => (
  <nav style={{ display: 'flex', gap: 12, marginBottom: 24, justifyContent: 'space-between', alignItems: 'center' }}>
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <h2 style={{ margin: 0, color: '#ff8c00', fontSize: '1.5rem', fontWeight: 'bold' }}>EMart</h2>
      {user && !user.isAdmin && <button onClick={() => setPage('shop')}>Shop</button>}
      {user && !user.isAdmin && <button onClick={() => setPage('cart')}>Cart ({cartCount})</button>}
    </div>
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      {user && <button onClick={() => { setUser(null); setPage('auth'); }}>Logout</button>}
      {!user && <button onClick={() => setPage('auth')}>Sign In</button>}
    </div>
  </nav>
);

function App() {
  const [page, setPage] = useState<'auth' | 'shop' | 'cart' | 'checkout' | 'admin'>('auth');
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Auth handlers
  const handleLogin = (user: User) => {
    setUser(user);
    if (user.isAdmin) {
      setPage('admin');
    } else {
      setPage('shop');
    }
  };

  // Cart handlers
  const handleAddToCart = (product: { id: number; name: string; price: number; image: string }) => {
    setCart(prev => {
      const found = prev.find(item => item.id === product.id);
      if (found) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      setCart(prev => prev.filter(item => item.id !== id));
    } else {
      setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
    }
  };

  const handleRemoveItem = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => setPage('checkout');

  // Checkout handler
  const handleOrderSubmit = (phone: string) => {
    if (!user) return;
    setOrders(prev => [
      ...prev,
      {
        id: prev.length + 1,
        email: user.email,
        phone,
        items: cart.map(({ name, quantity }) => ({ name, quantity })),
      },
    ]);
    setCart([]);
    setPage('shop');
    alert('Order placed!');
  };

  // Admin promo handler
  const handleSendPromo = (phone: string) => {
    // Here you would call your backend/SMS API
    alert(`Promo SMS sent to ${phone}`);
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
      <Nav user={user} cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} setPage={setPage} setUser={setUser} />
      {page === 'auth' && <AuthForm onLogin={handleLogin} />}
      {page === 'shop' && <Shop onAddToCart={handleAddToCart} />}
      {page === 'cart' && <Cart cart={cart} onCheckout={handleCheckout} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} />}
      {page === 'checkout' && <Checkout onSubmit={handleOrderSubmit} />}
      {page === 'admin' && <AdminPanel orders={orders} onSendPromo={handleSendPromo} adminEmail={user?.email} />}
    </div>
  );
}

export default App;

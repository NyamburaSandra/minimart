
import './App.css';
import React, { useState } from 'react';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
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
  setPage: React.Dispatch<React.SetStateAction<'login' | 'signup' | 'shop' | 'cart' | 'checkout' | 'admin'>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};
const Nav: React.FC<NavProps> = ({ user, cartCount, setPage, setUser }) => (
  <nav style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
    {user && !user.isAdmin && <button onClick={() => setPage('shop')}>🛒 Shop</button>}
    {user && !user.isAdmin && <button onClick={() => setPage('cart')}>🛍️ Cart ({cartCount})</button>}
    {user && <button onClick={() => { setUser(null); setPage('login'); }}>🚪 Logout</button>}
    {!user && <button onClick={() => setPage('login')}>🔐 Login</button>}
    {!user && <button onClick={() => setPage('signup')}>✍️ Sign Up</button>}
  </nav>
);

function App() {
  const [page, setPage] = useState<'login' | 'signup' | 'shop' | 'cart' | 'checkout' | 'admin'>('login');
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
  const handleSignup = (user: User) => {
    setUser(user);
    setPage('shop');
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
      {page === 'login' && <Login onLogin={handleLogin} />}
      {page === 'signup' && <Signup onSignup={handleSignup} />}
      {page === 'shop' && <Shop onAddToCart={handleAddToCart} />}
      {page === 'cart' && <Cart cart={cart} onCheckout={handleCheckout} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} />}
      {page === 'checkout' && <Checkout onSubmit={handleOrderSubmit} />}
      {page === 'admin' && <AdminPanel orders={orders} onSendPromo={handleSendPromo} adminEmail={user?.email} />}
    </div>
  );
}

export default App;

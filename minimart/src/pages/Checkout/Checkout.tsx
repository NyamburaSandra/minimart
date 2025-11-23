import React, { useState } from 'react';
import './Checkout.css';

const Checkout = ({ onSubmit }: { onSubmit: (phone: string) => void }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^\d{10,15}$/.test(phone)) {
      onSubmit(phone);
    } else {
      setError('Enter a valid phone number.');
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        {error && <div className="error">{error}</div>}
        <button type="submit">Pay & Place Order</button>
      </form>
    </div>
  );
};

export default Checkout;

import React, { useState } from 'react';
import './AdminPanel.css';

type Order = {
  id: number;
  email: string;
  phone: string;
  items: { name: string; quantity: number }[];
};

type AdminPanelProps = {
  orders: Order[];
  onSendPromo: (phone: string) => void;
  adminEmail?: string;
};

const AdminPanel: React.FC<AdminPanelProps> = ({ orders, onSendPromo, adminEmail }) => {
  const [promoMessage, setPromoMessage] = useState('Get 20% off on your next purchase!');
  const [sentPhones, setSentPhones] = useState<Set<string>>(new Set());

  const handleSendPromo = (phone: string) => {
    onSendPromo(phone);
    setSentPhones(new Set([...sentPhones, phone]));
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1>📊 Admin Dashboard</h1>
          <p>Manage orders and send promotional messages</p>
          {adminEmail && <p className="admin-email">Logged in as: {adminEmail}</p>}
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-number">{orders.length}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">${orders.reduce((sum, o) => sum + o.items.length * 2.5, 0).toFixed(2)}</div>
          <div className="stat-label">Estimated Revenue</div>
        </div>
      </div>

      <div className="promo-section">
        <h2>📧 Send Promo Messages</h2>
        <textarea
          className="promo-input"
          placeholder="Enter promo message..."
          value={promoMessage}
          onChange={e => setPromoMessage(e.target.value)}
          maxLength={160}
        />
        <div className="char-count">{promoMessage.length}/160</div>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <p>No orders yet. Orders will appear here when customers complete purchases.</p>
        </div>
      ) : (
        <div className="orders-section">
          <h2>📋 Recent Orders</h2>
          <div className="orders-grid">
            {orders.map(order => (
              <div className="order-card" key={order.id}>
                <div className="order-header">
                  <span className="order-id">Order #{order.id}</span>
                  <span className="order-status">✓ Completed</span>
                </div>
                <div className="order-content">
                  <div className="customer-info">
                    <div className="info-row">
                      <span className="label">📧 Email:</span>
                      <span className="value">{order.email}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">📞 Phone:</span>
                      <span className="value">{order.phone}</span>
                    </div>
                  </div>
                  <div className="items-section">
                    <div className="items-label">Items Purchased:</div>
                    <ul className="items-list">
                      {order.items.map(item => (
                        <li key={item.name}>
                          <span className="item-name">{item.name}</span>
                          <span className="item-qty">x{item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button
                  className={`send-promo-btn ${sentPhones.has(order.phone) ? 'sent' : ''}`}
                  onClick={() => handleSendPromo(order.phone)}
                  disabled={sentPhones.has(order.phone)}
                >
                  {sentPhones.has(order.phone) ? '✓ SMS Sent' : '💬 Send SMS Promo'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

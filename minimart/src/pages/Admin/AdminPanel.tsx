import React from 'react';
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
};

const AdminPanel: React.FC<AdminPanelProps> = ({ orders, onSendPromo }) => {
  return (
    <div className="admin-container">
      <h2>Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Phone</th>
              <th>Items</th>
              <th>Promo</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.email}</td>
                <td>{order.phone}</td>
                <td>
                  {order.items.map(item => (
                    <div key={item.name}>{item.name} x {item.quantity}</div>
                  ))}
                </td>
                <td>
                  <button onClick={() => onSendPromo(order.phone)}>Send SMS Promo</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPanel;

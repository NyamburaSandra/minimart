import './Shop.css'
import { useState } from 'react';

const products = [
  { id: 1, name: 'Milk', price: 250, image: '/assets/milk.png', category: 'Dairy', description: 'Fresh dairy milk' },
  { id: 2, name: 'Bread', price: 120, image: '/assets/bread.png', category: 'Bakery', description: 'Freshly baked bread' },
  { id: 3, name: 'Eggs', price: 300, image: '/assets/eggs.png', category: 'Dairy', description: 'Organic farm eggs' },
  { id: 4, name: 'Juice', price: 200, image: '/assets/juice.png', category: 'Beverages', description: 'Natural fresh juice' },
  { id: 5, name: 'Cheese', price: 450, image: '/assets/cheese.png', category: 'Dairy', description: 'Premium cheese' },
  { id: 6, name: 'Yogurt', price: 280, image: '/assets/yogurt.png', category: 'Dairy', description: 'Creamy yogurt' },
];

const Shop = ({ onAddToCart }: { onAddToCart: (product: { id: number; name: string; price: number; image: string }) => void }) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [addedId, setAddedId] = useState<number | null>(null);
  const categories = ['All', ...new Set(products.map(p => p.category))];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered = selectedCategory === 'All' ? products : products.filter(p => p.category === selectedCategory);

  const handleAddClick = (product: { id: number; name: string; price: number; image: string }) => {
    onAddToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1>🛒 Fresh Market</h1>
        <p className="shop-subtitle">Shop quality products at amazing prices</p>
      </div>

      <div className="category-filter">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="product-list">
        {filtered.map(product => (
          <div
            className="product-card"
            key={product.id}
            onMouseEnter={() => setHoveredId(product.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="product-image-wrapper">
              <img src={product.image} alt={product.name} className="product-image" />
              <div className="product-badge">{product.category}</div>
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-footer">
                <span className="price">KSH {product.price.toLocaleString()}</span>
                <button
                  className={`add-btn ${hoveredId === product.id ? 'hovered' : ''} ${addedId === product.id ? 'added' : ''}`}
                  onClick={() => handleAddClick(product)}
                >
                  {addedId === product.id ? '✓ Added!' : '+ Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;

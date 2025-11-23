import './Shop.css'

const products = [
  { id: 1, name: 'Milk', price: 2.5, image: '/assets/milk.png' },
  { id: 2, name: 'Bread', price: 1.2, image: '/assets/bread.png' },
  { id: 3, name: 'Eggs', price: 3.0, image: '/assets/eggs.png' },
  { id: 4, name: 'Juice', price: 2.0, image: '/assets/juice.png' },
];

const Shop = ({ onAddToCart }: { onAddToCart: (product: { id: number; name: string; price: number; image: string }) => void }) => {
  return (
    <div className="shop-container">
      <h2>Shop Items</h2>
      <div className="product-list">
        {products.map(product => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price.toFixed(2)}</p>
            <button onClick={() => onAddToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;

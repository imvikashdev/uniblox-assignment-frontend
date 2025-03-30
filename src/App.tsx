import './App.css';
import { ProductCard } from './components/ProductCard';
import { products } from './lib/products';

function App() {
  const handleAddToCart = (productId: string, name: string, price: number) => {
    console.log(`Adding to cart: ${name} (ID: ${productId}, Price: ${price})`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">E-commerce Store</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            imageUrl={product.imageUrl}
            description={product.description}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      <div className="text-center text-gray-500 mt-8">
        (Cart and Admin sections will be added later)
      </div>
    </div>
  );
}

export default App;

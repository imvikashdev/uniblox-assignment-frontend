import { useState } from 'react';
import './App.css';
import { ProductCard } from './components/ProductCard';
import { products } from './lib/products';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster, toast } from 'sonner';
import { addToCart } from './lib/api';

function App() {
  const [userId, setUserId] = useState<string>('user123');

  const handleAddToCart = async (
    productId: string,
    name: string,
    price: number,
  ) => {
    if (!userId) {
      toast.error('Please enter a User ID before adding items to the cart.');
      return;
    }

    console.log(
      `Adding to cart: ${name} (ID: ${productId}, Price: ${price}) for User: ${userId}`,
    );
    const loadingToastId = toast.loading(`Adding ${name} to cart...`); // Show loading toast

    try {
      const payload = {
        userId: userId,
        itemId: productId,
        name: name,
        price: price,
        quantity: 1,
      };

      const result = await addToCart(payload);

      toast.dismiss(loadingToastId);
      toast.success(result.message || `${name} added to cart!`, {
        description: `Item ID: ${result.item.itemId}, New Quantity: ${result.item.quantity}`,
      });
    } catch (error) {
      toast.dismiss(loadingToastId);
      if (error instanceof Error) {
        toast.error(`Failed to add ${name} to cart`, {
          description: error.message,
        });
      } else {
        toast.error(`Failed to add ${name} to cart`, {
          description: 'An unknown error occurred.',
        });
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-center" richColors />
      <h1 className="text-3xl font-bold mb-6 text-center">E-commerce Store</h1>

      <div className="mb-6 max-w-xs mx-auto">
        <Label htmlFor="userIdInput" className="mb-2 block text-sm font-medium">
          Enter User ID:
        </Label>
        <Input
          id="userIdInput"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="e.g., user123"
        />
        <p className="text-xs text-gray-500 mt-1">
          (Using '{userId}' for cart operations)
        </p>
      </div>

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

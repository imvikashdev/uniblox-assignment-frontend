import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { ProductCard } from './components/ProductCard';
import { products } from './lib/products';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster, toast } from 'sonner';
import {
  addToCart,
  CartItemResponse,
  getUserCart,
  OrderResponse,
  userCheckout,
} from './lib/api';
import { CartSheet } from './components/CartSheet';
import { Button } from './components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { CheckoutDialog } from './components/CheckoutDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

function App() {
  const [userId, setUserId] = useState<string>('user123');
  const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
  const [isCartLoading, setIsCartLoading] = useState<boolean>(false);
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] =
    useState<boolean>(false);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [lastOrder, setLastOrder] = useState<OrderResponse | null>(null); // To show confirmation
  const [isOrderConfirmationOpen, setIsOrderConfirmationOpen] =
    useState<boolean>(false);

  const fetchCart = useCallback(async () => {
    if (!userId) {
      setCartItems([]); // Clear cart if no user ID
      return;
    }
    setIsCartLoading(true);
    console.log(`Fetching cart for user: ${userId}`);
    try {
      const items = await getUserCart(userId);
      setCartItems(items);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      toast.error('Failed to load cart', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
      setCartItems([]);
    } finally {
      setIsCartLoading(false);
    }
  }, [userId]);

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
  const handleRemoveItem = (itemId: string) => {
    console.log(`TODO: Remove item with ID: ${itemId}`);
    toast.info(`Remove item functionality not implemented yet (ID: ${itemId})`);
  };
  const handleClearCart = () => {
    console.log('TODO: Clear cart functionality not implemented yet');
    toast.info('Clear cart functionality not implemented yet');
  };
  const handleOpenCheckout = () => {
    if (!userId) {
      toast.error('Please enter a User ID first.');
      return;
    }
    if (cartItems.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }
    setIsCheckoutDialogOpen(true);
  };

  const handleConfirmCheckout = async (discountCode?: string) => {
    if (!userId || cartItems.length === 0) return;

    setIsCheckingOut(true);
    const loadingToastId = toast.loading('Placing your order...');

    try {
      const payload = { userId, discountCode };
      const result = await userCheckout(payload);

      toast.dismiss(loadingToastId);
      toast.success(result.message || 'Order placed successfully!');

      setLastOrder(result.order);
      setIsOrderConfirmationOpen(true);
      setIsCheckoutDialogOpen(false);
      setCartItems([]);
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error('Checkout Failed', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
      setIsCheckoutDialogOpen(false);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const totalCartItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price || '0') * item.quantity,
    0,
  );
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);
  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-center" richColors />
      <CheckoutDialog
        userId={userId}
        subtotal={cartSubtotal}
        isOpen={isCheckoutDialogOpen}
        onOpenChange={setIsCheckoutDialogOpen}
        onConfirmCheckout={handleConfirmCheckout}
        isCheckingOut={isCheckingOut}
      />
      <AlertDialog
        open={isOrderConfirmationOpen}
        onOpenChange={setIsOrderConfirmationOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Order Confirmed!</AlertDialogTitle>
            <AlertDialogDescription>
              Your order (ID: {lastOrder?.id}) has been placed successfully.
              Total: ${lastOrder?.total}
              {lastOrder?.discountCode &&
                ` (Discount Applied: ${lastOrder.discountCode})`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setIsOrderConfirmationOpen(false)}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center flex-grow">
          E-commerce Store
        </h1>
        <CartSheet
          items={cartItems}
          isLoading={isCartLoading}
          trigger={
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-4 w-4" />
              {totalCartItems > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {totalCartItems}
                </span>
              )}
            </Button>
          }
          onClearCart={handleClearCart}
          onRemoveItem={handleRemoveItem}
          onCheckout={handleOpenCheckout}
        />
      </div>

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

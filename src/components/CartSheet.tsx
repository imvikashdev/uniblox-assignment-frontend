// src/components/CartSheet.tsx
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import type { CartItemResponse } from '@/lib/api';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';

type CartSheetProps = {
  items: CartItemResponse[];
  isLoading: boolean;
  trigger: React.ReactNode;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
  onClearCart: () => void;
};

export function CartSheet({
  items,
  isLoading,
  trigger,
  onRemoveItem,
  onCheckout,
  onClearCart,
}: CartSheetProps) {
  const subtotal = items.reduce((sum, item) => {
    const price = parseFloat(item.price || '0');
    return sum + price * item.quantity;
  }, 0);

  const formattedSubtotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(subtotal);

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="flex h-full flex-col sm:max-w-lg pr-0">
        <SheetHeader className="pr-6">
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            Review items in your cart before checkout.
          </SheetDescription>
        </SheetHeader>
        <Separator />

        <ScrollArea className="flex-grow mt-4">
          {isLoading && (
            <p className="text-center text-muted-foreground py-4">
              Loading cart...
            </p>
          )}
          {!isLoading && items.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Your cart is empty.
            </p>
          )}
          {!isLoading && items.length > 0 && (
            <div className="space-y-4 px-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4"
                >
                  <div className="flex-grow">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity} @ $
                      {parseFloat(item.price).toFixed(2)} each
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="font-semibold mb-1">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </p>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => onRemoveItem(item.itemId)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <SheetFooter className="mt-auto border-t bg-background p-6 flex flex-col gap-4">
          {items.length > 0 && (
            <div className="flex justify-between items-center font-semibold text-lg">
              <span>Subtotal:</span>
              <span>{formattedSubtotal}</span>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onClearCart}
              disabled={items.length === 0 || isLoading}
            >
              Clear Cart
            </Button>
            <Button
              type="button"
              disabled={items.length === 0 || isLoading}
              onClick={onCheckout}
              className="w-full sm:w-auto"
            >
              Proceed to Checkout
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

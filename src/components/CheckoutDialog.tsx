// src/components/CheckoutDialog.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type CheckoutDialogProps = {
  userId: string;
  subtotal: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmCheckout: (discountCode?: string) => Promise<void>;
  isCheckingOut: boolean;
};

export function CheckoutDialog({
  userId,
  subtotal,
  isOpen,
  onOpenChange,
  onConfirmCheckout,
  isCheckingOut,
}: CheckoutDialogProps) {
  const [discountCode, setDiscountCode] = useState('');

  const handleConfirm = async () => {
    await onConfirmCheckout(discountCode.trim() || undefined);
  };

  const formattedSubtotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(subtotal);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Checkout</DialogTitle>
          <DialogDescription>
            Review your order details and apply a discount code if available.
            User ID: {userId}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex justify-between items-center font-semibold">
            <span>Subtotal:</span>
            <span>{formattedSubtotal}</span>
          </div>

          <div className="">
            <Label
              htmlFor="discountCode"
              className="text-right col-span-1 mb-4"
            >
              Discount Code
            </Label>
            <Input
              id="discountCode"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="(Optional)"
              className="col-span-3"
              disabled={isCheckingOut}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={isCheckingOut}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? 'Placing Order...' : 'Place Order'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

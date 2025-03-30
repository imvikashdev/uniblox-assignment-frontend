// src/components/ProductCard.tsx
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type ProductCardProps = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  onAddToCart: (productId: string, name: string, price: number) => void;
};

export function ProductCard({
  id,
  name,
  price,
  imageUrl,
  description,
  onAddToCart,
}: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);

  const handleAddToCartClick = () => {
    onAddToCart(id, name, price);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <img
          src={imageUrl || '/placeholder.svg'}
          alt={name}
          className="mb-4 h-32 w-full object-cover rounded-md"
        />
        <p className="text-lg font-semibold">{formattedPrice}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddToCartClick} className="w-full">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

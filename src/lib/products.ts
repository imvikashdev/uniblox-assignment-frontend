import ClassicTShirt from '../assets/products/classic_tshirt.png';
import RunningSneakers from '../assets/products/running_sneakers.png';
import WirelessHeadphones from '../assets/products/wireless_headphones.png';
import CoffeeMug from '../assets/products/coffee_mug.png';
import LaptopBackpack from '../assets/products/laptop_backpack.png';
import StainlessSteelWaterBottle from '../assets/products/ss_bottle.png';
import YogaMat from '../assets/products/yoga_mat.png';
import DeskLamp from '../assets/products/desk_lamp.png';

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
};

export const products: Product[] = [
  {
    id: 'item001',
    name: 'Classic T-Shirt',
    price: 19.99,
    description: 'A classic t-shirt with a simple design.',
    imageUrl: ClassicTShirt,
  },
  {
    id: 'item002',
    name: 'Running Sneakers',
    price: 89.5,
    description: 'A pair of running sneakers with a comfortable fit.',
    imageUrl: RunningSneakers,
  },
  {
    id: 'item003',
    name: 'Wireless Headphones',
    price: 149.0,
    description: 'A pair of wireless headphones with a clear sound.',
    imageUrl: WirelessHeadphones,
  },
  {
    id: 'item004',
    name: 'Coffee Mug',
    price: 12.0,
    description: 'A coffee mug with a comfortable grip.',
    imageUrl: CoffeeMug,
  },
  {
    id: 'item005',
    name: 'Laptop Backpack',
    price: 55.0,
    description: 'Durable backpack with padded laptop sleeve.',
    imageUrl: LaptopBackpack,
  },
  {
    id: 'item006',
    name: 'Stainless Steel Water Bottle',
    price: 24.95,
    description: 'Insulated bottle, keeps drinks cold or hot.',
    imageUrl: StainlessSteelWaterBottle,
  },
  {
    id: 'item007',
    name: 'Yoga Mat',
    price: 35.0,
    description: 'Non-slip mat for your yoga practice.',
    imageUrl: YogaMat,
  },
  {
    id: 'item008',
    name: 'Desk Lamp',
    price: 42.5,
    description: 'Adjustable LED desk lamp with dimmer.',
    imageUrl: DeskLamp,
  },
];

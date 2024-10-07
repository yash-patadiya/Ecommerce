export interface Product {
  id: number; // or string, depending on your backend
  image: string;
  caption: string;
  price: number;
  description: string;
  rating: number;
  reviews: string[];

  category: string;
}

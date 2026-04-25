import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

export default function CustomStudioPage() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    api<Product[]>('/products?customizable=true').then(setProducts);
  }, []);
  return (
    <div className="space-y-5">
      <h2 className="text-3xl font-semibold">Custom Hat Studio</h2>
      <p className="text-white/70">Choose a blank cap, enter the 3D studio, upload your logo and save your design.</p>
      <div className="grid gap-5 md:grid-cols-3">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
    </div>
  );
}

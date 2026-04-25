import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({ color: '', style: '', category: '' });

  useEffect(() => {
    const params = new URLSearchParams({ type: 'READY_MADE', ...(filters.color && { color: filters.color }), ...(filters.style && { style: filters.style }), ...(filters.category && { category: filters.category }) });
    api<Product[]>(`/products?${params.toString()}`).then(setProducts);
  }, [filters]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold">Ready-Made Hat Shop</h2>
      <div className="grid gap-3 rounded-lg bg-panel p-4 md:grid-cols-3">
        <input placeholder="Filter color" className="rounded bg-black/40 p-2" onChange={(e) => setFilters((f) => ({ ...f, color: e.target.value }))} />
        <input placeholder="Filter style" className="rounded bg-black/40 p-2" onChange={(e) => setFilters((f) => ({ ...f, style: e.target.value }))} />
        <input placeholder="Filter category" className="rounded bg-black/40 p-2" onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))} />
      </div>
      <div className="grid gap-5 md:grid-cols-3">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
    </div>
  );
}

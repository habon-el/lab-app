import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { Product } from '../types';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => { if (id) api<Product>(`/products/${id}`).then(setProduct); }, [id]);

  if (!product) return <p>Loading...</p>;
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <img src={product.images[0]?.url || 'https://placehold.co/600x600'} className="w-full rounded-xl" />
      <div className="space-y-4">
        <h2 className="text-3xl font-semibold">{product.name}</h2>
        <p className="text-white/70">{product.description}</p>
        <p>${Number(product.price).toFixed(2)} • Stock: {product.stockQty}</p>
        <button className="rounded bg-accent px-5 py-3 text-black" onClick={async () => {
          await api('/cart/items', { method: 'POST', body: JSON.stringify({ productId: product.id, quantity: 1 }) });
          setMessage('Added to cart.');
        }}>Add to cart</button>
        {message && <p className="text-sm text-emerald-400">{message}</p>}
      </div>
    </div>
  );
}

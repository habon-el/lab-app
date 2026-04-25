import { Link } from 'react-router-dom';
import { Product } from '../types';

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0]?.url || 'https://placehold.co/600x600/111/fff?text=Hat';
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-panel">
      <img src={image} className="h-60 w-full object-cover" />
      <div className="space-y-3 p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-white/70">${Number(product.price).toFixed(2)}</p>
        <Link className="inline-block rounded bg-accent px-4 py-2 text-sm font-medium text-black" to={product.customizable ? `/customize/${product.id}` : `/product/${product.id}`}>
          {product.customizable ? 'Customize this hat' : 'Buy ready-made'}
        </Link>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { api } from '../lib/api';

type Cart = { id: string; items: Array<{ id: string; quantity: number; unitPrice: string; product: { name: string; images: { url: string }[] }; savedDesign?: { name: string } }> };

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);

  const load = () => api<Cart>('/cart').then(setCart);
  useEffect(() => { load(); }, []);

  const total = cart?.items.reduce((sum, i) => sum + Number(i.unitPrice) * i.quantity, 0) || 0;

  return (
    <div className="space-y-5">
      <h2 className="text-3xl font-semibold">Cart</h2>
      <div className="space-y-3">
        {cart?.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded bg-panel p-4">
            <div>
              <p>{item.product.name}</p>
              {item.savedDesign && <p className="text-sm text-accent">Custom: {item.savedDesign.name}</p>}
            </div>
            <div className="flex items-center gap-4">
              <span>${(Number(item.unitPrice) * item.quantity).toFixed(2)}</span>
              <button onClick={async () => { await api(`/cart/items/${item.id}`, { method: 'DELETE' }); load(); }}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xl">Total: ${total.toFixed(2)}</p>
      <a href="/checkout" className="inline-block rounded bg-accent px-4 py-2 text-black">Checkout placeholder</a>
    </div>
  );
}

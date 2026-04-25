import { useState } from 'react';
import { api } from '../lib/api';

export default function CheckoutPage() {
  const [msg, setMsg] = useState('');
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-semibold">Checkout (Placeholder)</h2>
      <p className="text-white/70">This MVP confirms orders without payment integration.</p>
      <button className="rounded bg-accent px-5 py-2 text-black" onClick={async () => {
        const result = await api<{ message: string; order: { id: string } }>('/checkout', { method: 'POST' });
        setMsg(`${result.message}. Order #${result.order.id}`);
      }}>Place order</button>
      {msg && <p className="text-emerald-400">{msg}</p>}
    </div>
  );
}

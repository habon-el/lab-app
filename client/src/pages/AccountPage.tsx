import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function AccountPage() {
  const [data, setData] = useState<{ orders: any[]; designs: any[] }>({ orders: [], designs: [] });
  useEffect(() => { api<{ orders: any[]; designs: any[] }>('/account').then(setData); }, []);

  return (
    <div className="space-y-5">
      <h2 className="text-3xl font-semibold">My Account</h2>
      <section>
        <h3 className="text-xl">Saved Designs</h3>
        <div className="space-y-2">{data.designs.map((d) => <div className="rounded bg-panel p-3" key={d.id}>{d.name} • {d.placement}</div>)}</div>
      </section>
      <section>
        <h3 className="text-xl">Orders</h3>
        <div className="space-y-2">{data.orders.map((o) => <div className="rounded bg-panel p-3" key={o.id}>#{o.id.slice(-8)} • {o.status} • ${Number(o.total).toFixed(2)}</div>)}</div>
      </section>
    </div>
  );
}

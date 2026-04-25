import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

const statuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const load = () => api<any[]>('/admin/orders').then(setOrders);
  useEffect(() => { load(); }, []);

  return <div className="space-y-3"><h2 className="text-3xl font-semibold">Orders</h2>{orders.map((o) => (
    <div key={o.id} className="rounded bg-panel p-3">
      <div className="flex items-center justify-between">
        <span>#{o.id.slice(-8)} • {o.user.email} • ${Number(o.total).toFixed(2)}</span>
        <select value={o.status} onChange={async (e) => { await api(`/admin/orders/${o.id}`, { method: 'PATCH', body: JSON.stringify({ status: e.target.value }) }); load(); }} className="rounded bg-black/50 p-1">
          {statuses.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
    </div>
  ))}</div>;
}

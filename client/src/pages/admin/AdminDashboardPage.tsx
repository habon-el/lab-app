import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { api('/admin/dashboard').then(setData); }, []);
  if (!data) return <p>Loading...</p>;
  return (
    <div className="space-y-5">
      <h2 className="text-3xl font-semibold">Admin Dashboard</h2>
      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded bg-panel p-4">Products: {data.products}</div>
        <div className="rounded bg-panel p-4">Low stock: {data.lowStock.length}</div>
        <div className="rounded bg-panel p-4">Recent orders: {data.orders.length}</div>
        <div className="rounded bg-panel p-4">Saved designs: {data.designs.length}</div>
      </div>
    </div>
  );
}

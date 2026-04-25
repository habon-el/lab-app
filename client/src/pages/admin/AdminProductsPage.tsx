import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const load = () => api<any[]>('/products?active=true').then(setProducts);
  useEffect(() => { load(); }, []);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold">Manage Products</h2>
        <Link className="rounded bg-accent px-4 py-2 text-black" to="/admin/products/new">Add Product</Link>
      </div>
      {products.map((p) => (
        <div className="flex items-center justify-between rounded bg-panel p-3" key={p.id}>
          <div>{p.name} • {p.customizable ? 'Blank' : 'Ready-Made'} • Stock {p.stockQty}</div>
          <div className="space-x-3">
            <Link to={`/admin/products/${p.id}/edit`}>Edit</Link>
            <button onClick={async () => { await api(`/admin/products/${p.id}`, { method: 'DELETE' }); load(); }}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

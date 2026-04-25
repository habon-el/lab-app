import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function AdminDesignsPage() {
  const [designs, setDesigns] = useState<any[]>([]);
  useEffect(() => { api<any[]>('/admin/designs').then(setDesigns); }, []);
  return (
    <div className="space-y-3">
      <h2 className="text-3xl font-semibold">Saved Custom Designs</h2>
      {designs.map((d) => <div key={d.id} className="rounded bg-panel p-3">{d.name} • {d.user.email} • {d.product.name} • {d.decorationType}</div>)}
    </div>
  );
}

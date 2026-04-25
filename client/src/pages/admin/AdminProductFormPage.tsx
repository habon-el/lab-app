import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api';

const initial = { name: '', description: '', price: 29, hatStyle: 'Baseball Cap', colors: 'Black', sizes: 'One Size', category: 'Streetwear', stockQty: 50, modelPath: '/models/hat.glb', active: true, customizable: false, images: '' };

export default function AdminProductFormPage() {
  const { id } = useParams();
  const [form, setForm] = useState(initial);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    api<any>(`/products/${id}`).then((p) => setForm({
      name: p.name, description: p.description, price: Number(p.price), hatStyle: p.hatStyle, colors: p.colors.join(','), sizes: p.sizes.join(','), category: p.category, stockQty: p.stockQty, modelPath: p.modelPath || '/models/hat.glb', active: p.active, customizable: p.customizable, images: p.images.map((i: any) => i.url).join(',')
    }));
  }, [id]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), stockQty: Number(form.stockQty), colors: form.colors.split(',').map((v) => v.trim()), sizes: form.sizes.split(',').map((v) => v.trim()), images: form.images.split(',').map((v) => v.trim()) };
    if (id) await api(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    else await api('/admin/products', { method: 'POST', body: JSON.stringify(payload) });
    navigate('/admin/products');
  };

  return (
    <form className="space-y-3 rounded bg-panel p-6" onSubmit={submit}>
      <h2 className="text-2xl font-semibold">{id ? 'Edit Product' : 'New Product'}</h2>
      {Object.entries(form).map(([k, v]) => typeof v === 'boolean' ? (
        <label key={k} className="flex gap-2"><input type="checkbox" checked={v} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.checked }))} />{k}</label>
      ) : (
        <input key={k} className="w-full rounded bg-black/40 p-2" value={String(v)} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} placeholder={k} />
      ))}
      <button className="rounded bg-accent px-4 py-2 text-black">Save Product</button>
    </form>
  );
}

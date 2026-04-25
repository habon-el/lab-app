import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { Product } from '../types';
import { HatCanvas } from '../components/HatCanvas';
import { placements, useCustomizerStore } from '../store/useCustomizerStore';
import logo1 from '../assets/logos/logo-1.svg';
import logo2 from '../assets/logos/logo-2.svg';
import logo3 from '../assets/logos/logo-3.svg';

const sampleLogos = [logo1, logo2, logo3];

export default function CustomizePage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState('');
  const { placement, setPlacement, imageUrl, setImageUrl, customText, setCustomText, decorationType, setDecorationType, transform, updateTransform, autoRotate, setAutoRotate } = useCustomizerStore();

  useEffect(() => {
    if (id) api<Product>(`/products/${id}`).then(setProduct);
  }, [id]);
  const previewName = useMemo(() => `${product?.name || 'Hat'} Design`, [product?.name]);

  if (!product) return <p>Loading...</p>;

  const onUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageUrl(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[340px,1fr]">
      <aside className="space-y-4 rounded-xl bg-panel p-4">
        <h3 className="text-xl font-semibold">Customize: {product.name}</h3>
        <select className="w-full rounded bg-black/40 p-2" value={placement} onChange={(e) => setPlacement(e.target.value as (typeof placements)[number])}>
          {placements.map((p) => <option key={p}>{p}</option>)}
        </select>
        <input type="file" accept="image/*" onChange={onUpload} className="w-full text-sm" />
        <input placeholder="Custom text" className="w-full rounded bg-black/40 p-2" value={customText} onChange={(e) => setCustomText(e.target.value)} />
        <select className="w-full rounded bg-black/40 p-2" value={decorationType} onChange={(e) => setDecorationType(e.target.value as 'embroidery' | 'patch' | 'print')}>
          <option value="embroidery">Embroidery</option>
          <option value="patch">Patch</option>
          <option value="print">Print</option>
        </select>
        <div className="grid grid-cols-2 gap-2">
          <label>Scale<input type="range" min="0.4" max="2" step="0.1" value={transform.scale} onChange={(e) => updateTransform({ scale: Number(e.target.value) })} /></label>
          <label>Rotate<input type="range" min="-3.14" max="3.14" step="0.1" value={transform.rotation} onChange={(e) => updateTransform({ rotation: Number(e.target.value) })} /></label>
          <label>X<input type="range" min="-0.3" max="0.3" step="0.01" value={transform.x} onChange={(e) => updateTransform({ x: Number(e.target.value) })} /></label>
          <label>Y<input type="range" min="-0.3" max="0.3" step="0.01" value={transform.y} onChange={(e) => updateTransform({ y: Number(e.target.value) })} /></label>
        </div>
        <label className="flex items-center gap-2"><input type="checkbox" checked={autoRotate} onChange={(e) => setAutoRotate(e.target.checked)} />Auto-rotate</label>

        <p className="text-sm text-white/70">Sample logo library:</p>
        <div className="grid grid-cols-3 gap-2">{sampleLogos.map((logo) => <button key={logo} onClick={() => setImageUrl(logo)} className="rounded border border-white/20 p-2"><img src={logo} /></button>)}</div>

        <button className="w-full rounded bg-accent p-2 font-semibold text-black" onClick={async () => {
          const design = await api<{ id: string }>('/designs', {
            method: 'POST',
            body: JSON.stringify({ productId: product.id, name: previewName, customText, decorationType, placement, imageUrl, transform })
          });
          await api('/cart/items', { method: 'POST', body: JSON.stringify({ productId: product.id, savedDesignId: design.id, quantity: 1 }) });
          setStatus('Design saved and added to cart.');
        }}>Save design + Add to cart</button>
        {status && <p className="text-sm text-emerald-400">{status}</p>}
      </aside>
      <HatCanvas />
    </div>
  );
}

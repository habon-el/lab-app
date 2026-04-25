import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <section className="grid gap-10 md:grid-cols-2">
      <div className="space-y-6">
        <p className="text-sm uppercase tracking-[0.3em] text-accent">Launch-ready MVP</p>
        <h1 className="text-5xl font-bold leading-tight">Build your signature cap in 3D.</h1>
        <p className="text-white/70">Customize blank hats with logos/text or buy premium ready-made drops.</p>
        <div className="flex gap-4">
          <Link className="rounded bg-accent px-5 py-3 font-semibold text-black" to="/custom-studio">Start Customizing</Link>
          <Link className="rounded border border-white/20 px-5 py-3" to="/shop">Shop Ready-Made</Link>
        </div>
      </div>
      <div className="rounded-xl border border-white/10 bg-panel p-6">
        <h3 className="mb-4 text-xl font-semibold">Two product experiences</h3>
        <ul className="space-y-3 text-sm text-white/80">
          <li>• Custom Hat Studio — choose blank, upload logo, place and save design.</li>
          <li>• Ready-Made Shop — browse branded hats and buy instantly.</li>
          <li>• Unified cart supports both product types and checkout placeholder.</li>
        </ul>
      </div>
    </section>
  );
}

import { Link, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export function Layout() {
  const { user, logout } = useAuthStore();
  return (
    <div className="min-h-screen bg-surface text-white">
      <header className="border-b border-white/10 bg-black/30 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-semibold tracking-wide">3D Hat Studio</Link>
          <div className="flex gap-5 text-sm">
            <Link to="/shop">Shop</Link>
            <Link to="/custom-studio">Custom Studio</Link>
            <Link to="/cart">Cart</Link>
            {user ? <Link to="/account">Account</Link> : <Link to="/login">Login</Link>}
            {user?.role === 'ADMIN' && <Link to="/admin/dashboard">Admin</Link>}
            {user && <button onClick={logout}>Logout</button>}
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8"><Outlet /></main>
    </div>
  );
}

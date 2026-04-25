import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function AuthPage() {
  const location = useLocation();
  const isSignup = location.pathname === '/signup';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, signup } = useAuthStore();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (isSignup) await signup(email, password);
      else await login(email, password);
      navigate('/account');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <form className="mx-auto max-w-md space-y-4 rounded-xl bg-panel p-6" onSubmit={onSubmit}>
      <h2 className="text-2xl font-semibold">{isSignup ? 'Create account' : 'Login'}</h2>
      <input className="w-full rounded bg-black/40 p-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input className="w-full rounded bg-black/40 p-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      {error && <p className="text-red-400">{error}</p>}
      <button className="w-full rounded bg-accent p-2 font-semibold text-black">{isSignup ? 'Sign up' : 'Login'}</button>
    </form>
  );
}

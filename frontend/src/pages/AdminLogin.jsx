import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../services/api';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export const AdminLogin = () => {
  const [email, setEmail] = useState('admin@arzooman.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginAdmin(email, password);
      if (res && res.access_token) {
        localStorage.setItem('adminToken', res.access_token);
        navigate('/admin/dashboard');
      } else {
        setError('Login failed. Invalid response token.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-card border border-border p-8 rounded-3xl shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-foreground/10 flex items-center justify-center mb-4">
            <ShieldCheck size={24} className="text-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage portfolio content & media assets
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-foreground/80 uppercase tracking-wider mb-2">
              Admin Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                <Mail size={16} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                placeholder="admin@arzooman.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground/80 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                <Lock size={16} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-foreground text-background font-bold text-sm rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-8 text-center border-t border-border pt-6">
          <a href="/" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
            ← Return to Live Portfolio
          </a>
        </div>
      </div>
    </div>
  );
};

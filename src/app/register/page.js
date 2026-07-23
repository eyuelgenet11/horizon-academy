'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../login/page.css';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setLoading(false);
      setError(data.error || 'Registration failed.');
      return;
    }

    // Auto sign-in after successful registration
    await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    router.push('/learning-portal');
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass">
        <div className="auth-header">
          <h1 className="auth-title">Join <span className="text-gradient">Horizon</span></h1>
          <p className="auth-subtitle">Create your free account and start learning today.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name" name="name" type="text"
              placeholder="Your full name"
              value={form.name} onChange={handleChange} required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email" name="email" type="email"
              placeholder="you@example.com"
              value={form.email} onChange={handleChange} required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password" name="password" type="password"
              placeholder="At least 6 characters"
              value={form.password} onChange={handleChange} required
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm">Confirm Password</label>
            <input
              id="confirm" name="confirm" type="password"
              placeholder="Repeat your password"
              value={form.confirm} onChange={handleChange} required
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{' '}
          <Link href="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

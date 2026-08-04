'use client';
import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import '../login/page.css';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'in_person' ? 'in_person_addis' : 'online';

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', learningMode: initialMode });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password, learningMode: form.learningMode }),
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

      setLoading(false);
      setRegisteredUser({
        name: form.name,
        email: form.email,
        learningMode: form.learningMode,
        regRef: `HRZ-${Date.now().toString().slice(-6)}`,
      });
    } catch (err) {
      setLoading(false);
      setError('Registration error. Please check connection.');
    }
  };

  if (registeredUser) {
    const isAddis = registeredUser.learningMode === 'in_person_addis';
    const isBahirDar = registeredUser.learningMode === 'in_person_bahirdar';
    const modeLabel = isAddis
      ? 'In-Person (Addis Ababa Campus - Megenagna)'
      : isBahirDar
      ? 'In-Person (Bahir Dar Campus - Millennium Bldg)'
      : 'Online Learning (Live & Portal)';

    const whatsappMessage = encodeURIComponent(
      `Hello Horizon Reception! I just registered online.\nName: ${registeredUser.name}\nEmail: ${registeredUser.email}\nRef: ${registeredUser.regRef}\nMode: ${modeLabel}\nI would like to complete my fee payment and confirm my schedule.`
    );

    return (
      <div className="auth-card glass" style={{ maxWidth: '600px', padding: '2rem' }}>
        <div className="text-center mb-4">
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</div>
          <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid #10B981', padding: '0.25rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
            Registration Received! Ref: {registeredUser.regRef}
          </span>
          <h1 className="auth-title" style={{ marginTop: '0.75rem' }}>Welcome, <span className="text-gradient">{registeredUser.name}</span>!</h1>
          <p className="text-muted" style={{ fontSize: '0.95rem' }}>
            Your account is created. To activate your enrollment and finalize your schedule, please contact reception or complete fee payment below.
          </p>
        </div>

        {/* Learning Mode Selected */}
        <div className="glass p-3 radius-md mb-4" style={{ borderLeft: '4px solid var(--color-primary)', background: 'rgba(255,255,255,0.03)' }}>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Selected Mode:</strong> <span style={{ color: 'var(--color-primary-light)' }}>{modeLabel}</span>
          </p>
        </div>

        {/* STEP 1: Contact Reception via WhatsApp or Phone */}
        <div className="mb-4">
          <h3 style={{ fontSize: '1.05rem', color: 'var(--color-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            💬 Contact Reception to Complete Registration & Pay Fee
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1rem' }}>
            Send your registration reference to our reception on WhatsApp or call directly to pay your fee and pick your class time:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <a
              href={`https://wa.me/251977787358?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full text-center"
              style={{ padding: '0.75rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#25D366', borderColor: '#25D366', color: '#fff' }}
            >
              💬 WhatsApp Reception Chat (+251 977 787 358)
            </a>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <a href="tel:+251989795758" className="btn btn-outline text-center" style={{ fontSize: '0.85rem', padding: '0.6rem' }}>
                📞 Call +251 989 795 758
              </a>
              <a href="tel:+251977785758" className="btn btn-outline text-center" style={{ fontSize: '0.85rem', padding: '0.6rem' }}>
                📞 Call +251 977 785 758
              </a>
            </div>
          </div>
        </div>

        {/* STEP 2: Bank Transfer Details */}
        <div className="glass p-3 radius-md mb-4" style={{ borderRadius: '14px', border: '1px solid rgba(242, 101, 34, 0.25)', background: 'rgba(242, 101, 34, 0.04)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', color: 'var(--color-primary)' }}>🏦 CBE Bank Transfer Instructions</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.88rem', lineHeight: '1.7' }}>
            <li><strong>Bank Name:</strong> Commercial Bank of Ethiopia (CBE)</li>
            <li><strong>Account Number:</strong> <span style={{ color: 'var(--color-primary-light)', fontWeight: 'bold', fontSize: '1rem' }}>1000311734249</span></li>
            <li><strong>Account Name:</strong> Getachew Marie</li>
            <li><em>Note: Send transfer receipt screenshot to WhatsApp (+251 977 787 358) or bring to reception.</em></li>
          </ul>
        </div>

        {/* STEP 3: Reception Office Locations */}
        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '10px' }}>
          <p style={{ margin: '0 0 0.3rem 0' }}>📍 <strong>Addis Ababa Office:</strong> Megenagna Metebaber Bldg, 5th Fl (Rm #513) & 7th Fl</p>
          <p style={{ margin: '0 0 0.3rem 0' }}>📍 <strong>Bahir Dar Office:</strong> Millennium Bldg 1st Fl & 7th Fl (Next to Signal Mall)</p>
          <p style={{ margin: 0 }}>🕐 Working Hours: <strong>24/7 Always Open</strong></p>
        </div>

        {/* Secondary Portal Navigation */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/learning-portal" className="btn btn-outline w-full text-center" style={{ fontSize: '0.88rem' }}>
            Go to Student Portal 🚀
          </Link>
          <Link href="/courses" className="btn btn-secondary w-full text-center" style={{ fontSize: '0.88rem' }}>
            Browse Courses Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-card glass" style={{ maxWidth: '520px' }}>
      <div className="auth-header">
        <h1 className="auth-title">Join <span className="text-gradient">Horizon Center</span></h1>
        <p className="auth-subtitle">Create your account to start Online or In-Person learning.</p>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="learningMode">Select Learning Mode</label>
          <select
            id="learningMode"
            name="learningMode"
            value={form.learningMode}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'var(--text-color)', fontSize: '0.9rem' }}
          >
            <option value="online">💻 Online Learning (Portal & Live Zoom)</option>
            <option value="in_person_addis">🏫 In-Person: Addis Ababa (Megenagna Metebaber Bldg, 5th Fl Rm #513)</option>
            <option value="in_person_bahirdar">🏫 In-Person: Bahir Dar (Millennium Bldg 1st Fl, Next to Signal Mall)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            id="name" name="name" type="text"
            placeholder="Your full name"
            value={form.name} onChange={handleChange} required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            id="email" name="email" type="email"
            placeholder="you@example.com"
            value={form.email} onChange={handleChange} required
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <input
            id="password" name="password" type="password"
            placeholder="At least 6 characters"
            value={form.password} onChange={handleChange} required
            autoComplete="new-password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirm">Confirm Password *</label>
          <input
            id="confirm" name="confirm" type="password"
            placeholder="Repeat your password"
            value={form.confirm} onChange={handleChange} required
            autoComplete="new-password"
          />
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ marginTop: '0.5rem' }}>
          {loading ? 'Creating account…' : 'Complete Registration 🎓'}
        </button>
      </form>

      <p className="auth-footer-text">
        Already have an account?{' '}
        <Link href="/login" className="auth-link">Sign in</Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="auth-page">
      <Suspense fallback={<div className="glass padding-lg radius-lg text-center">Loading Registration Portal...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}


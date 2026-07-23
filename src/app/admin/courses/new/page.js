'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../admin.css';

export default function NewCoursePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    level: 'Beginner',
    duration: '3 Months',
    price: '0',
    imageUrl: 'bg-orange',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price) || 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create course.');
      }

      router.push('/admin/courses');
      router.refresh();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Create New Course</h1>
        <p className="admin-page-subtitle">Publish a new program package to the platform.</p>
      </div>

      <div className="form-wrapper glass padding-lg radius-lg" style={{ maxWidth: '640px' }}>
        {error && <div className="admin-error mb-4" style={{ padding: '0.75rem', borderRadius: '4px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label htmlFor="title">Course Title *</label>
            <input id="title" name="title" type="text" placeholder="e.g. Spoken English Mastery" value={form.title} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea id="description" name="description" rows="4" placeholder="Course outline, audience and description..." value={form.description} onChange={handleChange} required />
          </div>

          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="level">Levels / Target *</label>
              <input id="level" name="level" type="text" placeholder="e.g. Beginner, Advanced" value={form.level} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="duration">Duration *</label>
              <input id="duration" name="duration" type="text" placeholder="e.g. 3 Months, 6 Weeks" value={form.duration} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="price">Price (ETB) *</label>
              <input id="price" name="price" type="number" min="0" value={form.price} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="imageUrl">Banner Style Swatch *</label>
              <select id="imageUrl" name="imageUrl" value={form.imageUrl} onChange={handleChange}>
                <option value="bg-orange">Orange Gradient</option>
                <option value="bg-blue">Blue Gradient</option>
                <option value="bg-green">Green Gradient</option>
                <option value="bg-purple">Purple Gradient</option>
                <option value="bg-red">Red Gradient</option>
                <option value="bg-teal">Teal Gradient</option>
              </select>
            </div>
          </div>

          <div className="form-submit mt-4" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => router.push('/admin/courses')} className="btn btn-outline" style={{ borderRadius: 'var(--radius-full)' }}>Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)' }}>{loading ? 'Creating...' : 'Create Course'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

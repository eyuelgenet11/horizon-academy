'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../admin.css';

import CloudinaryUpload from '@/components/CloudinaryUpload';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    isPublished: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTitleChange = (e) => {
    const titleVal = e.target.value;
    // Auto-generate slug: convert spaces to dashes, strip symbols, lowercase
    const slugVal = titleVal
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    
    setForm({
      ...form,
      title: titleVal,
      slug: slugVal,
    });
  };

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create blog post.');
      }

      router.push('/admin/blog');
      router.refresh();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Write Blog Post</h1>
        <p className="admin-page-subtitle">Publish language learning resources or announcements.</p>
      </div>

      <div className="form-wrapper glass padding-lg radius-lg" style={{ maxWidth: '720px' }}>
        {error && <div className="admin-error mb-4" style={{ padding: '0.75rem', borderRadius: '4px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label htmlFor="title">Post Title *</label>
            <input id="title" name="title" type="text" placeholder="e.g. 5 Tips to Speak English Confidently" value={form.title} onChange={handleTitleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="slug">Post Slug (URL-friendly) *</label>
            <input id="slug" name="slug" type="text" placeholder="e.g. 5-tips-to-speak-english-confidently" value={form.slug} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="excerpt">Excerpt Summary</label>
            <input id="excerpt" name="excerpt" type="text" placeholder="A brief one-sentence hook summary..." value={form.excerpt} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">Cover Image URL (optional)</label>
            <input id="imageUrl" name="imageUrl" type="url" placeholder="e.g. https://res.cloudinary.com/..." value={form.imageUrl} onChange={handleChange} />
            <CloudinaryUpload
              label="Upload Cover Image"
              fileType="image"
              onUploadSuccess={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
            />
          </div>


          <div className="form-group">
            <label htmlFor="content">Post Article Body *</label>
            <textarea id="content" name="content" rows="10" placeholder="Type the main article contents (supports standard HTML or text)..." value={form.content} onChange={handleChange} required />
          </div>

          <div className="form-group-checkbox" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input id="isPublished" name="isPublished" type="checkbox" checked={form.isPublished} onChange={handleChange} />
            <label htmlFor="isPublished" style={{ fontWeight: '600' }}>Publish immediately (visible to public)</label>
          </div>

          <div className="form-submit mt-4" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => router.push('/admin/blog')} className="btn btn-outline" style={{ borderRadius: 'var(--radius-full)' }}>Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)' }}>{loading ? 'Publishing...' : 'Publish Post'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

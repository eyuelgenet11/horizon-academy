'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CloudinaryUpload from '@/components/CloudinaryUpload';

export default function AddLessonForm({ courseId, nextOrder }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    videoUrl: '',
    audioUrl: '',
    pdfUrl: '',
    content: '',
    isZoomClass: false,
    zoomStartTime: '',
    zoomDuration: 60,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          courseId,
          order: nextOrder,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add lesson.');
      }

      setSuccess(true);
      setForm({
        title: '',
        videoUrl: '',
        audioUrl: '',
        pdfUrl: '',
        content: '',
        isZoomClass: false,
        zoomStartTime: '',
        zoomDuration: 60,
      });
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', padding: '0.5rem', backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: '4px', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}
      {success && <div style={{ color: '#22c55e', fontSize: '0.85rem' }}>✅ Lesson added successfully!</div>}

      <div className="form-group">
        <label htmlFor="title">Lesson Title *</label>
        <input id="title" name="title" type="text" placeholder="e.g. Spoken Practice — Conversation" value={form.title} onChange={handleChange} required />
      </div>

      <div className="form-group-checkbox" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
        <input id="isZoomClass" name="isZoomClass" type="checkbox" checked={form.isZoomClass} onChange={handleChange} />
        <label htmlFor="isZoomClass" style={{ fontWeight: '600', color: 'var(--color-primary)' }}>🎥 Schedule as Live Zoom Class</label>
      </div>

      {form.isZoomClass ? (
        <div className="zoom-scheduling-fields" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', background: 'rgba(242, 101, 34, 0.05)', borderRadius: '8px', border: '1px dashed var(--color-primary)' }}>
          <div className="form-group">
            <label htmlFor="zoomStartTime">Class Date & Time (Addis Ababa) *</label>
            <input id="zoomStartTime" name="zoomStartTime" type="datetime-local" value={form.zoomStartTime} onChange={handleChange} required={form.isZoomClass} />
          </div>
          <div className="form-group">
            <label htmlFor="zoomDuration">Duration (minutes) *</label>
            <input id="zoomDuration" name="zoomDuration" type="number" min="15" max="360" value={form.zoomDuration} onChange={handleChange} required={form.isZoomClass} />
          </div>
        </div>
      ) : (
        <>
          <div className="form-group">
            <label htmlFor="videoUrl">Video URL (optional)</label>
            <input id="videoUrl" name="videoUrl" type="url" placeholder="e.g. https://res.cloudinary.com/..." value={form.videoUrl} onChange={handleChange} />
            <CloudinaryUpload
              label="Upload Video"
              fileType="video"
              onUploadSuccess={(url) => setForm((prev) => ({ ...prev, videoUrl: url }))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="audioUrl">Audio URL (optional)</label>
            <input id="audioUrl" name="audioUrl" type="url" placeholder="e.g. https://res.cloudinary.com/..." value={form.audioUrl} onChange={handleChange} />
            <CloudinaryUpload
              label="Upload Audio"
              fileType="audio"
              onUploadSuccess={(url) => setForm((prev) => ({ ...prev, audioUrl: url }))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="pdfUrl">PDF Document URL (optional)</label>
            <input id="pdfUrl" name="pdfUrl" type="url" placeholder="e.g. https://res.cloudinary.com/..." value={form.pdfUrl} onChange={handleChange} />
            <CloudinaryUpload
              label="Upload PDF Guide"
              fileType="raw"
              onUploadSuccess={(url) => setForm((prev) => ({ ...prev, pdfUrl: url }))}
            />
          </div>
        </>
      )}

      <div className="form-group">
        <label htmlFor="content">Lesson Reading Text (optional)</label>
        <textarea id="content" name="content" rows="4" placeholder="Plain text or markdown content..." value={form.content} onChange={handleChange} />
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary mt-2 w-full text-center">
        {loading ? 'Adding...' : 'Add Lesson Module'}
      </button>
    </form>
  );
}



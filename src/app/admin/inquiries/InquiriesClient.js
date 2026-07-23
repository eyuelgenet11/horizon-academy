'use client';
import { useState } from 'react';

export default function InquiriesClient({ initialInquiries }) {
  const [inquiries, setInquiries] = useState(initialInquiries);

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'READ' }),
      });

      if (res.ok) {
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? { ...inq, status: 'READ' } : inq))
        );
      }
    } catch (err) {
      console.error('Failed to mark inquiry as read:', err);
    }
  };

  const unreadCount = inquiries.filter((i) => i.status === 'UNREAD').length;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Contact Inquiries</h1>
        <p className="admin-page-subtitle">
          {unreadCount} unread of {inquiries.length} total inquiries
        </p>
      </div>

      <div className="inquiries-list">
        {inquiries.length === 0 && (
          <div className="glass inquiry-empty" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No contact inquiries yet.
          </div>
        )}
        {inquiries.map((inq) => (
          <div key={inq.id} className={`inquiry-card glass ${inq.status === 'UNREAD' ? 'unread' : ''}`} style={{ borderLeft: inq.status === 'UNREAD' ? '4px solid var(--color-primary)' : '1px solid var(--border-color)' }}>
            <div className="inquiry-header" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <strong style={{ fontSize: '1.1rem', display: 'block' }}>{inq.name}</strong>
                <div style={{ fontSize: '0.85rem', display: 'flex', gap: '1rem', marginTop: '0.2rem', color: 'var(--text-muted)' }}>
                  <a href={`mailto:${inq.email}`} style={{ color: 'var(--color-primary)' }}>{inq.email}</a>
                  {inq.phone && <span>📞 {inq.phone}</span>}
                </div>
              </div>
              <div className="inquiry-meta" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span className={`status-badge ${inq.status === 'UNREAD' ? 'status-active' : 'status-completed'}`} style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  {inq.status}
                </span>
                <span className="inquiry-date" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {new Date(inq.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            {inq.subject && <p className="inquiry-subject" style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Subject: {inq.subject}</p>}
            <p className="inquiry-message" style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.25rem' }}>{inq.message}</p>
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a href={`mailto:${inq.email}?subject=Re: ${inq.subject || 'Your Inquiry'}`} className="btn btn-primary btn-sm" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', borderRadius: 'var(--radius-full)' }}>
                ✉️ Reply via Email
              </a>
              {inq.status === 'UNREAD' && (
                <button
                  onClick={() => markAsRead(inq.id)}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', borderRadius: 'var(--radius-full)' }}
                >
                  ✓ Mark as Read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

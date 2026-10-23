'use client';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function AdminSidebarFooter({ userName }) {
  return (
    <div className="admin-user-footer" style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div>
        <p className="admin-user-name" style={{ fontWeight: '600', fontSize: '0.9rem', margin: 0 }}>{userName}</p>
        <p className="admin-user-role" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.1rem 0 0 0' }}>Administrator</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <Link
          href="/"
          className="btn btn-outline w-full text-center"
          style={{ fontSize: '0.82rem', padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-md)' }}
        >
          🌐 View Main Website
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="btn btn-primary w-full text-center"
          style={{ fontSize: '0.82rem', padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-md)', background: '#ef4444', borderColor: '#ef4444', color: '#fff' }}
        >
          🚪 Log Out
        </button>
      </div>
    </div>
  );
}

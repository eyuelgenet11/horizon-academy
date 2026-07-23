import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import './admin.css';

export default async function AdminLayout({ children }) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') redirect('/');

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar glass">
        <div className="admin-logo">
          <span className="text-gradient">Admin</span> Panel
        </div>
        <nav className="admin-nav">
          <Link href="/admin" className="admin-nav-link">📊 Overview</Link>
          <Link href="/admin/courses" className="admin-nav-link">📚 Courses</Link>
          <Link href="/admin/students" className="admin-nav-link">👥 Students</Link>
          <Link href="/admin/blog" className="admin-nav-link">📝 Blog</Link>
          <Link href="/admin/inquiries" className="admin-nav-link">📬 Inquiries</Link>
          <Link href="/admin/settings" className="admin-nav-link">⚙️ Settings</Link>
        </nav>
        <div className="admin-user">
          <p className="admin-user-name">{session.user.name}</p>
          <p className="admin-user-role">Administrator</p>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}

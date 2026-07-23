import prisma from '@/lib/prisma';
import Link from 'next/link';
import '../admin.css';

export const metadata = { title: 'Admin — Blog' };

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="admin-page">
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Blog Posts</h1>
          <p className="admin-page-subtitle">{posts.length} total posts</p>
        </div>
        <Link href="/admin/blog/new" className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)' }}>
          ➕ Write Post
        </Link>
      </div>

      <div className="admin-table-wrap glass">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id}>
                <td><strong>{p.title}</strong></td>
                <td><code>{p.slug}</code></td>
                <td>
                  <span className={`status-badge ${p.isPublished ? 'status-active' : 'status-cancelled'}`}>
                    {p.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr><td colSpan={4} className="table-empty">No blog posts yet. Use the API to create posts.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import prisma from '@/lib/prisma';
import Link from 'next/link';
import '../admin.css';

export const metadata = { title: 'Admin — Courses' };

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    include: { _count: { select: { lessons: true, enrollments: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="admin-page">
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Courses</h1>
          <p className="admin-page-subtitle">Manage your course catalog</p>
        </div>
        <Link href="/admin/courses/new" className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)' }}>
          ➕ Add Course
        </Link>
      </div>

      <div className="admin-table-wrap glass">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Level</th>
              <th>Duration</th>
              <th>Lessons</th>
              <th>Enrolled</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id}>
                 <td>
                   <Link href={`/admin/courses/${c.id}`} style={{ fontWeight: '700', color: 'var(--color-primary)' }}>
                     {c.title}
                   </Link>
                 </td>
                <td>{c.level}</td>
                <td>{c.duration}</td>
                <td>{c._count.lessons}</td>
                <td>{c._count.enrollments}</td>
                <td>{c.price === 0 ? 'Free' : `${c.price} ETB`}</td>
                <td>
                  <span className={`status-badge ${c.isPublished ? 'status-active' : 'status-cancelled'}`}>
                    {c.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr><td colSpan={7} className="table-empty">No courses yet. Add courses via the API.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

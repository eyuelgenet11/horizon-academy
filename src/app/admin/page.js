import prisma from '@/lib/prisma';
import './admin.css';

export const metadata = { title: 'Admin — Overview' };

async function getStats() {
  const [students, courses, enrollments, inquiries, posts] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.course.count(),
    prisma.enrollment.count({ where: { status: 'ACTIVE' } }),
    prisma.contactInquiry.count({ where: { status: 'UNREAD' } }),
    prisma.blogPost.count({ where: { isPublished: true } }),
  ]);
  return { students, courses, enrollments, inquiries, posts };
}

async function getRecentEnrollments() {
  return prisma.enrollment.findMany({
    take: 8,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true } },
    },
  });
}

export default async function AdminOverviewPage() {
  const [stats, recent] = await Promise.all([getStats(), getRecentEnrollments()]);

  const cards = [
    { label: 'Total Students', value: stats.students, icon: '👥', color: 'blue' },
    { label: 'Active Courses', value: stats.courses, icon: '📚', color: 'orange' },
    { label: 'Active Enrollments', value: stats.enrollments, icon: '✅', color: 'green' },
    { label: 'Unread Inquiries', value: stats.inquiries, icon: '📬', color: 'red' },
    { label: 'Published Posts', value: stats.posts, icon: '📝', color: 'purple' },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Dashboard Overview</h1>
        <p className="admin-page-subtitle">Welcome back. Here&apos;s what&apos;s happening today.</p>
      </div>

      <div className="admin-stats-grid">
        {cards.map((c) => (
          <div key={c.label} className={`admin-stat-card glass accent-${c.color}`}>
            <div className="admin-stat-icon">{c.icon}</div>
            <div className="admin-stat-value">{c.value}</div>
            <div className="admin-stat-label">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="admin-section">
        <h2>Recent Enrollments</h2>
        <div className="admin-table-wrap glass">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((e) => (
                <tr key={e.id}>
                  <td>
                    <div className="table-user">
                      <strong>{e.user.name}</strong>
                      <small>{e.user.email}</small>
                    </div>
                  </td>
                  <td>{e.course.title}</td>
                  <td>{new Date(e.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge status-${e.status.toLowerCase()}`}>
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr><td colSpan={4} className="table-empty">No enrollments yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

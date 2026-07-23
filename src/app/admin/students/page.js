import prisma from '@/lib/prisma';
import Link from 'next/link';
import '../admin.css';

export const metadata = { title: 'Admin — Students' };

export default async function AdminStudentsPage() {
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    include: { _count: { select: { enrollments: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Students</h1>
        <p className="admin-page-subtitle">{students.length} registered students</p>
      </div>

      <div className="admin-table-wrap glass">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Enrolled Courses</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td><strong>{s.name}</strong></td>
                <td>{s.email}</td>
                <td>{s._count.enrollments}</td>
                <td>{new Date(s.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr><td colSpan={4} className="table-empty">No students yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

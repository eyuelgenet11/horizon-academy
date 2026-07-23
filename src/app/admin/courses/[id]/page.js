import prisma from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AddLessonForm from './AddLessonForm';
import '../../admin.css';

export const metadata = { title: 'Admin — Manage Course' };

export default async function ManageCoursePage({ params }) {
  const resolvedParams = await params;
  const course = await prisma.course.findUnique({
    where: { id: resolvedParams.id },
    include: {
      lessons: { orderBy: { order: 'asc' } },
    },
  });

  if (!course) notFound();

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <Link href="/admin/courses" className="back-link" style={{ color: 'var(--color-primary)', display: 'inline-block', marginBottom: '1rem', textDecoration: 'none', fontWeight: '600' }}>
          ← Back to Courses List
        </Link>
        <h1>Manage: {course.title}</h1>
        <p className="admin-page-subtitle">Syllabus curriculum has {course.lessons.length} active lesson modules.</p>
      </div>

      <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Lesson list */}
        <div className="lessons-list-section glass padding-lg radius-lg">
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.25rem' }}>Course Curriculum Outline</h2>
          
          <div className="curriculum-timeline" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {course.lessons.length === 0 ? (
              <p className="text-muted" style={{ padding: '1.5rem 0', textAlign: 'center' }}>No lessons added yet. Use the form on the right to append modules.</p>
            ) : (
              course.lessons.map((lesson, idx) => (
                <div key={lesson.id} className="timeline-item" style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: '700', marginRight: '0.5rem', color: 'var(--color-primary)' }}>{idx + 1}.</span>
                    <strong>{lesson.title}</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {lesson.videoUrl && <span style={{ fontSize: '0.75rem', background: 'rgba(242,101,34,0.1)', color: 'var(--color-primary)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Video</span>}
                    {lesson.pdfUrl && <span style={{ fontSize: '0.75rem', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>PDF</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add lesson form component */}
        <div className="add-lesson-section glass padding-lg radius-lg">
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.25rem' }}>Add New Lesson</h2>
          <AddLessonForm courseId={course.id} nextOrder={course.lessons.length + 1} />
        </div>

      </div>
    </div>
  );
}

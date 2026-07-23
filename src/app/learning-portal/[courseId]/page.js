import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import LessonPlayer from './LessonPlayer';
import './page.css';

async function getCourseData(courseId, userId) {
  const [course, progress, enrollment] = await Promise.all([
    prisma.course.findUnique({
      where: { id: courseId },
      include: { lessons: { orderBy: { order: 'asc' } } },
    }),
    prisma.progress.findMany({ where: { userId, lesson: { courseId } } }),
    prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    }),
  ]);
  return { course, progress, enrollment };
}

export default async function CoursePlayerPage({ params }) {
  const session = await auth();
  if (!session) redirect('/login');

  const resolvedParams = await params;
  const { course, progress, enrollment } = await getCourseData(resolvedParams.courseId, session.user.id);

  if (!course) notFound();
  if (!enrollment) redirect(`/courses`); // Not enrolled

  const completedIds = new Set(progress.filter((p) => p.completed).map((p) => p.lessonId));
  const completedCount = completedIds.size;
  const totalCount = course.lessons.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="course-player-page">
      <div className="player-header glass">
        <div className="container player-header-inner">
          <Link href="/learning-portal" className="back-link">← Dashboard</Link>
          <div>
            <h1>{course.title}</h1>
            <p>{completedCount} / {totalCount} lessons completed ({pct}%)</p>
          </div>
          <div className="player-progress-bar">
            <div className="player-progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <div className="container player-layout">
        {/* Sidebar — lesson list */}
        <aside className="lesson-sidebar glass">
          <h3>Lessons</h3>
          <ul className="lesson-list">
            {course.lessons.map((lesson, idx) => (
              <li key={lesson.id} className={`lesson-item ${completedIds.has(lesson.id) ? 'completed' : ''}`}>
                <span className="lesson-num">{idx + 1}</span>
                <span className="lesson-title">{lesson.title}</span>
                {completedIds.has(lesson.id) && <span className="lesson-check">✓</span>}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main lesson player area */}
        <main className="lesson-main">
          {course.lessons.length === 0 ? (
            <div className="glass no-lessons">
              <p>📭 No lessons have been added to this course yet. Check back soon!</p>
            </div>
          ) : (
            <LessonPlayer lessons={course.lessons} completedIds={[...completedIds]} />
          )}
        </main>
      </div>
    </div>
  );
}

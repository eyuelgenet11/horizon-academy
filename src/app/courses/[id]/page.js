import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EnrollButton from './EnrollButton';
import './page.css';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const course = await prisma.course.findUnique({ where: { id: resolvedParams.id } });
  if (!course) return { title: 'Course Not Found' };
  return {
    title: `${course.title} | Horizon Academy`,
    description: course.description,
  };
}

export default async function CourseDetailPage({ params }) {
  const session = await auth();
  const resolvedParams = await params;
  
  const course = await prisma.course.findUnique({
    where: { id: resolvedParams.id },
    include: {
      lessons: { orderBy: { order: 'asc' } },
    },
  });

  if (!course) notFound();

  let isEnrolled = false;
  if (session) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: course.id,
        },
      },
    });
    isEnrolled = !!enrollment;
  }

  return (
    <div className="course-detail-page">
      <section className="course-detail-hero">
        <div className="container hero-grid">
          <div className="hero-text-wrap">
            <span className="level-tag">{course.level}</span>
            <h1>{course.title}</h1>
            <p className="description">{course.description}</p>
            
            <div className="quick-stats mt-4">
              <div>
                <strong>Duration:</strong>
                <span>{course.duration}</span>
              </div>
              <div>
                <strong>Lessons:</strong>
                <span>{course.lessons.length} Modules</span>
              </div>
              <div>
                <strong>Price:</strong>
                <span>{course.price === 0 ? 'Free' : `${course.price} ETB`}</span>
              </div>
            </div>
          </div>
          
          <div className="hero-action-card glass">
            <div className={`card-banner ${course.imageUrl || 'bg-orange'}`} />
            <div className="card-body">
              <h3>Start Learning Today</h3>
              <p className="card-note">Get instant access to speaking practices, quizzes, and digital completion certificates.</p>
              
              {isEnrolled ? (
                <Link href={`/learning-portal/${course.id}`} className="btn btn-primary w-full text-center">
                  Go to Lesson Player 🚀
                </Link>
              ) : (
                <EnrollButton courseId={course.id} isLoggedIn={!!session} />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="course-curriculum container">
        <h2>Course Syllabus & Curriculum</h2>
        <p className="section-subtitle">Outline of the modules covered in this training program.</p>
        
        <div className="syllabus-list mt-4">
          {course.lessons.length === 0 ? (
            <div className="glass empty-syllabus">
              <p>📭 The curriculum details are being finalized. Check back soon!</p>
            </div>
          ) : (
            course.lessons.map((lesson, index) => (
              <div key={lesson.id} className="syllabus-item glass">
                <span className="syllabus-num">{index + 1}</span>
                <div className="syllabus-info">
                  <h4>{lesson.title}</h4>
                  {lesson.content && <p className="syllabus-summary">Interactive reading & speaking exercise</p>}
                </div>
                <div className="syllabus-meta">
                  {lesson.videoUrl && <span className="meta-icon">🎥 Video</span>}
                  {lesson.audioUrl && <span className="meta-icon">🎵 Audio</span>}
                  {lesson.pdfUrl && <span className="meta-icon">📄 Material</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

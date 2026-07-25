import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import CertificateDownload from '@/components/CertificateDownload';
import './page.css';

export const metadata = { title: 'My Learning Portal' };

async function getStudentDashboardData(userId) {
  // Fetch user's active enrollments
  const activeEnrollments = await prisma.enrollment.findMany({
    where: { userId, status: 'ACTIVE' },
    include: {
      course: {
        include: { _count: { select: { lessons: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const enrolledCourseIds = new Set(activeEnrollments.map((e) => e.courseId));

  // Fetch published courses not yet enrolled by the student
  const availableCourses = await prisma.course.findMany({
    where: {
      isPublished: true,
      id: { notIn: Array.from(enrolledCourseIds) },
    },
    include: { _count: { select: { lessons: true } } },
    orderBy: { createdAt: 'asc' },
  });

  const completedLessons = await prisma.progress.findMany({
    where: { userId, completed: true },
    include: { lesson: { select: { courseId: true } } },
  });

  const certificates = await prisma.certificate.findMany({
    where: { userId },
    include: { course: { select: { title: true } } },
  });

  return { activeEnrollments, availableCourses, completedLessons, certificates };
}

export default async function LearningPortalPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const { activeEnrollments, availableCourses, completedLessons, certificates } =
    await getStudentDashboardData(session.user.id);

  const totalLessons = activeEnrollments.reduce((acc, e) => acc + e.course._count.lessons, 0);
  const completedLessonsCount = completedLessons.length;
  const progressPct = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;

  return (
    <div className="portal-page">
      <section className="portal-hero">
        <div className="container">
          <h1>Welcome back, <span className="text-gradient">{session.user.name}</span></h1>
          <p className="portal-subtitle">Track your learning progress and manage your active programs.</p>
        </div>
      </section>

      <div className="container portal-content">

        {/* Overview Stats */}
        <div className="stats-grid">
          <div className="stat-card glass">
            <div className="stat-number">{activeEnrollments.length}</div>
            <div className="stat-label">Active Enrolled Courses</div>
          </div>
          <div className="stat-card glass">
            <div className="stat-number">{completedLessonsCount}</div>
            <div className="stat-label">Lessons Completed</div>
          </div>
          <div className="stat-card glass">
            <div className="stat-number">{progressPct}%</div>
            <div className="stat-label">Overall Completion Rate</div>
          </div>
          <div className="stat-card glass">
            <div className="stat-number">{certificates.length}</div>
            <div className="stat-label">Certificates Earned</div>
          </div>
        </div>

        {/* SECTION 1: Enrolled / Purchased Courses */}
        <div className="section-block mt-5">
          <div className="section-block-header">
            <h2>🎓 My Enrolled Courses ({activeEnrollments.length})</h2>
            <Link href="/courses" className="btn btn-outline btn-sm">Explore All Courses</Link>
          </div>

          {activeEnrollments.length === 0 ? (
            <div className="empty-state glass text-center p-5 radius-lg">
              <p className="text-muted">You have not enrolled in any programs yet.</p>
              <Link href="/courses" className="btn btn-primary mt-3">Browse Catalog & Enroll</Link>
            </div>
          ) : (
            <div className="course-cards-grid">
              {activeEnrollments.map((enrollment) => {
                const completedInCourse = completedLessons.filter(
                  (p) => p.lesson.courseId === enrollment.courseId
                ).length;
                const totalInCourse = enrollment.course._count.lessons;
                const courseProgressPct =
                  totalInCourse > 0 ? Math.round((completedInCourse / totalInCourse) * 100) : 0;

                return (
                  <Link key={enrollment.id} href={`/learning-portal/${enrollment.courseId}`} className="portal-course-card glass hover-lift">
                    <div className="pccard-header bg-orange">
                      <span className="status-badge-active">✓ Unlocked</span>
                    </div>
                    <div className="pccard-body">
                      <h3>{enrollment.course.title}</h3>
                      <p className="text-muted">{totalInCourse} lesson modules</p>
                      
                      <div className="progress-info mt-3">
                        <span className="progress-label">{completedInCourse}/{totalInCourse} Completed</span>
                        <span className="progress-pct">{courseProgressPct}%</span>
                      </div>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar" style={{ width: `${courseProgressPct}%` }} />
                      </div>

                      <button className="btn btn-primary btn-sm w-full mt-3">
                        Resume Learning 🚀
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* SECTION 2: Available / Unpaid Courses for Quick Unlock */}
        {availableCourses.length > 0 && (
          <div className="section-block mt-5">
            <div className="section-block-header">
              <h2>📚 Explore Additional Programs</h2>
              <p className="section-desc">Unlock new language and technical skill programs.</p>
            </div>

            <div className="course-cards-grid mt-3">
              {availableCourses.map((course) => (
                <div key={course.id} className="portal-course-card glass hover-lift">
                  <div className={`pccard-header ${course.imageUrl || 'bg-blue'}`}>
                    <span className="price-badge">{course.price === 0 ? 'Free' : `${course.price} ETB`}</span>
                  </div>
                  <div className="pccard-body">
                    <h3>{course.title}</h3>
                    <p className="text-muted">{course._count.lessons} lesson modules • {course.level}</p>
                    <p className="course-snippet mt-2">{course.description}</p>
                    <Link href={`/courses/${course.id}`} className="btn btn-outline btn-sm w-full mt-3 text-center">
                      {course.price === 0 ? 'Enroll Free' : `Unlock Program (${course.price} ETB)`}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: Certificates */}
        {certificates.length > 0 && (
          <div className="section-block mt-5">
            <h2>🎓 My Certificates of Completion</h2>
            <div className="cert-grid mt-3">
              {certificates.map((cert) => (
                <div key={cert.id} className="cert-card glass">
                  <div className="cert-icon">🎓</div>
                  <div>
                    <h3>{cert.course.title}</h3>
                    <p className="text-muted">Issued on: {new Date(cert.issuedAt).toLocaleDateString()}</p>
                    <CertificateDownload
                      studentName={session.user.name}
                      courseTitle={cert.course.title}
                      completionDate={new Date(cert.issuedAt).toLocaleDateString()}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

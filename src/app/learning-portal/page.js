import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import CertificateDownload from '@/components/CertificateDownload';
import './page.css';

export const metadata = { title: 'My Dashboard' };

async function getStudentData(userId) {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: { _count: { select: { lessons: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const completedLessons = await prisma.progress.findMany({
    where: { userId, completed: true },
    include: { lesson: { select: { courseId: true } } },
  });

  const certificates = await prisma.certificate.findMany({
    where: { userId },
    include: { course: { select: { title: true } } },
  });

  return { enrollments, completedLessons, certificates };
}

export default async function LearningPortalPage() {
  const session = await auth();
  if (!session) redirect('/login');

  const { enrollments, completedLessons, certificates } = await getStudentData(session.user.id);
  const totalLessons = enrollments.reduce((acc, e) => acc + e.course._count.lessons, 0);
  const completedLessonsCount = completedLessons.length;
  const progressPct = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;

  return (
    <div className="portal-page">
      <section className="portal-hero">
        <div className="container">
          <h1>Welcome back, <span className="text-gradient">{session.user.name}</span> 👋</h1>
          <p className="portal-subtitle">Track your progress and continue where you left off.</p>
        </div>
      </section>

      <div className="container portal-content">

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card glass">
            <div className="stat-number">{enrollments.length}</div>
            <div className="stat-label">Enrolled Courses</div>
          </div>
          <div className="stat-card glass">
            <div className="stat-number">{completedLessonsCount}</div>
            <div className="stat-label">Lessons Completed</div>
          </div>
          <div className="stat-card glass">
            <div className="stat-number">{progressPct}%</div>
            <div className="stat-label">Overall Progress</div>
          </div>
          <div className="stat-card glass">
            <div className="stat-number">{certificates.length}</div>
            <div className="stat-label">Certificates Earned</div>
          </div>
        </div>

        {/* My Courses */}
        <div className="section-block">
          <div className="section-block-header">
            <h2>My Courses</h2>
            <Link href="/courses" className="btn btn-outline btn-sm">Browse More</Link>
          </div>

          {enrollments.length === 0 ? (
            <div className="empty-state glass">
              <p>You haven&apos;t enrolled in any courses yet.</p>
              <Link href="/courses" className="btn btn-primary mt-2">Browse Courses</Link>
            </div>
          ) : (
            <div className="course-cards-grid">
              {enrollments.map((enrollment) => {
                const completedInCourse = completedLessons.filter(
                  (p) => p.lesson.courseId === enrollment.courseId
                ).length;
                const totalInCourse = enrollment.course._count.lessons;
                const courseProgressPct = totalInCourse > 0 ? Math.round((completedInCourse / totalInCourse) * 100) : 0;

                return (
                  <Link key={enrollment.id} href={`/learning-portal/${enrollment.courseId}`} className="portal-course-card glass hover-lift">
                    <div className="pccard-header bg-orange" />
                    <div className="pccard-body">
                      <span className={`status-badge status-${enrollment.status.toLowerCase()}`}>
                        {enrollment.status}
                      </span>
                      <h3>{enrollment.course.title}</h3>
                      <p>{enrollment.course._count.lessons} lessons</p>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar" style={{ width: `${courseProgressPct}%` }} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Certificates */}
        {certificates.length > 0 && (
          <div className="section-block">
            <h2>My Certificates</h2>
            <div className="cert-grid">
              {certificates.map((cert) => (
                <div key={cert.id} className="cert-card glass">
                  <div className="cert-icon">🎓</div>
                  <div>
                    <h3>{cert.course.title}</h3>
                    <p>Issued: {new Date(cert.issuedAt).toLocaleDateString()}</p>
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

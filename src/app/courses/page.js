import Link from 'next/link';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import './page.css';

const DEFAULT_COURSES = [
  {
    title: "Spoken English",
    level: "Beginner, Intermediate, Advanced",
    duration: "3 Months",
    description: "Master practical communication with our intensive spoken English programs.",
    price: 5,
    imageUrl: "bg-orange"
  },
  {
    title: "Pronunciation Mastery",
    level: "All Levels",
    duration: "6 Weeks",
    description: "Sound more natural and confident by mastering English sounds and rhythm.",
    price: 5,
    imageUrl: "bg-blue"
  },
  {
    title: "Kids English",
    level: "Kids",
    duration: "Ongoing",
    description: "Fun and interactive learning environment for young learners to build a strong foundation.",
    price: 5,
    imageUrl: "bg-green"
  },
  {
    title: "IELTS Preparation",
    level: "Intermediate, Advanced",
    duration: "2 Months",
    description: "Comprehensive training to achieve your target band score for study or work abroad.",
    price: 5,
    imageUrl: "bg-purple"
  },
  {
    title: "Spanish Language",
    level: "Beginner",
    duration: "3 Months",
    description: "Learn the basics of Spanish communication for personal growth.",
    price: 5,
    imageUrl: "bg-red"
  },
  {
    title: "Computer Training",
    level: "Basic IT",
    duration: "1 Month",
    description: "Essential computer skills for the modern workplace.",
    price: 5,
    imageUrl: "bg-teal"
  }
];

async function getCatalogData(userId) {
  try {
    let courses = await prisma.course.findMany({
      where: { isPublished: true },
      include: { _count: { select: { lessons: true } } },
      orderBy: { createdAt: 'asc' }
    });

    if (courses.length === 0) {
      for (const item of DEFAULT_COURSES) {
        await prisma.course.create({
          data: {
            title: item.title,
            description: item.description,
            level: item.level,
            duration: item.duration,
            price: item.price,
            imageUrl: item.imageUrl,
            isPublished: true,
          }
        });
      }
      courses = await prisma.course.findMany({
        where: { isPublished: true },
        include: { _count: { select: { lessons: true } } },
        orderBy: { createdAt: 'asc' }
      });
    }

    let enrolledCourseIds = new Set();
    if (userId) {
      const activeEnrollments = await prisma.enrollment.findMany({
        where: { userId, status: 'ACTIVE' },
        select: { courseId: true }
      });
      enrolledCourseIds = new Set(activeEnrollments.map(e => e.courseId));
    }

    return { courses, enrolledCourseIds };
  } catch (err) {
    console.error("Failed to load courses:", err);
    return { courses: [], enrolledCourseIds: new Set() };
  }
}

export default async function CoursesPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const { courses, enrolledCourseIds } = await getCatalogData(userId);

  const unlockedCourses = courses.filter(c => enrolledCourseIds.has(c.id));
  const availableCourses = courses.filter(c => !enrolledCourseIds.has(c.id));

  return (
    <div className="courses-page">
      <section className="courses-header text-center">
        <div className="container animate-fade-in">
          <h1 className="section-title">Academic <span className="text-gradient">Catalog</span></h1>
          <p className="hero-subtitle mx-auto">Explore our wide range of language and skill development courses designed to help you succeed.</p>
        </div>
      </section>

      <div className="container course-catalog">

        {/* SECTION 1: Unlocked / Enrolled Courses (For Logged-in Students) */}
        {userId && unlockedCourses.length > 0 && (
          <div className="catalog-section mb-5">
            <div className="catalog-section-header">
              <h2>🎓 My Enrolled Programs <span className="badge-count">{unlockedCourses.length}</span></h2>
              <p className="section-desc">Courses you have unlocked and are currently active in.</p>
            </div>

            <div className="courses-grid mt-4">
              {unlockedCourses.map((course) => (
                <div key={course.id} className="course-card glass hover-lift enrolled-card">
                  <div className={`course-banner ${course.imageUrl || 'bg-orange'}`}>
                    <span className="enrolled-ribbon">✓ Unlocked & Active</span>
                  </div>
                  <div className="course-content">
                    <h2>{course.title}</h2>
                    <p className="course-desc">{course.description}</p>
                    <ul className="course-details mt-4">
                      <li><strong>Duration:</strong> {course.duration}</li>
                      <li><strong>Levels:</strong> {course.level}</li>
                      <li><strong>Lessons:</strong> {course._count?.lessons || 0} active modules</li>
                    </ul>
                    <Link href={`/learning-portal/${course.id}`} className="btn btn-primary mt-auto w-full text-center">
                      Continue Learning 🚀
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: Available Programs (Unenrolled / Open for Purchase) */}
        <div className="catalog-section">
          <div className="catalog-section-header">
            <h2>
              {userId && unlockedCourses.length > 0 ? '📚 Available Programs to Unlock' : '📚 All Academic Programs'}
            </h2>
            <p className="section-desc">Browse programs open for enrollment and start your learning journey today.</p>
          </div>

          <div className="courses-grid mt-4">
            {availableCourses.map((course) => (
              <div key={course.id} className="course-card glass hover-lift">
                <div className={`course-banner ${course.imageUrl || 'bg-orange'}`}>
                  <span className="price-tag">{course.price === 0 ? 'Free' : `${course.price} ETB`}</span>
                </div>
                <div className="course-content">
                  <h2>{course.title}</h2>
                  <p className="course-desc">{course.description}</p>
                  <ul className="course-details mt-4">
                    <li><strong>Duration:</strong> {course.duration}</li>
                    <li><strong>Levels:</strong> {course.level}</li>
                    <li><strong>Lessons:</strong> {course._count?.lessons || 0} active modules</li>
                  </ul>
                  <Link href={`/courses/${course.id}`} className="btn btn-outline mt-auto w-full text-center">
                    {course.price === 0 ? 'Enroll Free' : `Unlock Course (${course.price} ETB)`}
                  </Link>
                </div>
              </div>
            ))}

            {availableCourses.length === 0 && (
              <div className="glass p-5 text-center radius-lg">
                <p className="text-muted">🎉 You have enrolled in all available academic programs!</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

import Link from 'next/link';
import prisma from '@/lib/prisma';
import './page.css';

const DEFAULT_COURSES = [
  {
    title: "Spoken English",
    level: "Beginner, Intermediate, Advanced",
    duration: "3 Months",
    description: "Master practical communication with our intensive spoken English programs.",
    price: 0,
    imageUrl: "bg-orange"
  },
  {
    title: "Pronunciation Mastery",
    level: "All Levels",
    duration: "6 Weeks",
    description: "Sound more natural and confident by mastering English sounds and rhythm.",
    price: 0,
    imageUrl: "bg-blue"
  },
  {
    title: "Kids English",
    level: "Kids",
    duration: "Ongoing",
    description: "Fun and interactive learning environment for young learners to build a strong foundation.",
    price: 0,
    imageUrl: "bg-green"
  },
  {
    title: "IELTS Preparation",
    level: "Intermediate, Advanced",
    duration: "2 Months",
    description: "Comprehensive training to achieve your target band score for study or work abroad.",
    price: 0,
    imageUrl: "bg-purple"
  },
  {
    title: "Spanish Language",
    level: "Beginner",
    duration: "3 Months",
    description: "Learn the basics of Spanish communication for personal growth.",
    price: 0,
    imageUrl: "bg-red"
  },
  {
    title: "Computer Training",
    level: "Basic IT",
    duration: "1 Month",
    description: "Essential computer skills for the modern workplace.",
    price: 0,
    imageUrl: "bg-teal"
  }
];

async function getCourses() {
  try {
    let courses = await prisma.course.findMany({
      where: { isPublished: true },
      include: { _count: { select: { lessons: true } } },
      orderBy: { createdAt: 'asc' }
    });

    // Auto-seed if database contains no courses
    if (courses.length === 0) {
      console.log("Auto-seeding default program catalog...");
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
    return courses;
  } catch (err) {
    console.error("Failed to load courses:", err);
    return [];
  }
}

export default async function Courses() {
  const courses = await getCourses();

  return (
    <div className="courses-page">
      <section className="courses-header text-center">
        <div className="container animate-fade-in">
          <h1 className="section-title">Our <span className="text-gradient">Programs</span></h1>
          <p className="hero-subtitle mx-auto">Explore our wide range of language and skill development courses designed to help you succeed.</p>
        </div>
      </section>

      <section className="course-catalog container">
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course.id} className="course-card glass hover-lift">
              <div className={`course-banner ${course.imageUrl || 'bg-orange'}`}></div>
              <div className="course-content">
                <h2>{course.title}</h2>
                <p className="course-desc">{course.description}</p>
                <ul className="course-details mt-4">
                  <li><strong>Duration:</strong> {course.duration}</li>
                  <li><strong>Levels:</strong> {course.level}</li>
                  <li><strong>Lessons:</strong> {course._count?.lessons || 0} active modules</li>
                </ul>
                <Link href={`/courses/${course.id}`} className="btn btn-primary mt-auto w-full text-center">
                  Learn & Enroll
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


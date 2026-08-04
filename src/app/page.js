'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/components/LanguageContext';
import './page.css';

export default function Home() {
  const { t } = useTranslation();

  const whyChooseUsFeatures = t('whyChooseUs.features') || [];
  const testimonialList = t('successStories.list') || [];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content animate-fade-in">
          <h1 className="hero-title">
            {t('hero.title')} <span className="text-gradient">{t('hero.weapon')}</span>
          </h1>
          <p className="hero-subtitle stagger-1">
            {t('hero.subtitle')}
          </p>
          <div className="hero-actions stagger-2">
            <Link href="/register" className="btn btn-primary">{t('hero.enrollNow')}</Link>
            <Link href="/contact" className="btn btn-outline">{t('hero.contactUs')}</Link>
            <Link href="/courses" className="btn btn-secondary">{t('hero.exploreCourses')}</Link>
          </div>

          {/* Official Academy Banner Showcase */}
          <div className="hero-banner-wrap glass radius-lg overflow-hidden">
            <Image
              src="/banner.jpg"
              alt="Horizon Center Official Academy Banner"
              width={700}
              height={400}
              className="hero-banner-img"
              priority
            />
          </div>
        </div>
      </section>

      {/* TOP-LEVEL REGISTRATION SECTION (Online & In-Person Options) */}
      <section className="top-register-section bg-secondary padding-lg">
        <div className="container">
          <div className="text-center mb-4">
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>🎓 Start Learning Today</span>
            <h2 className="section-title" style={{ margin: '0.25rem 0 0.5rem 0' }}>Register to Learn <span className="text-gradient">Online</span> or <span className="text-gradient">In-Person</span></h2>
            <p className="text-muted max-w-lg mx-auto" style={{ fontSize: '1.05rem', margin: 0 }}>
              Join over 2,000+ students. Choose your preferred learning environment below to get started immediately.
            </p>
          </div>

          <div className="registration-grid">
            {/* Card 1: Register for Online Learning */}
            <div className="glass padding-lg radius-lg hover-lift" style={{ borderRadius: '20px', border: '1px solid rgba(252, 101, 36, 0.3)', position: 'relative' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>💻</div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Register for Online Learning</h3>
              <p className="text-muted" style={{ fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Study from anywhere in Ethiopia or abroad! Access interactive video lessons, live Zoom speaking sessions, digital materials, and quizzes.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
                <li>✓ Live Spoken English & Zoom practice</li>
                <li>✓ 24/7 Portal & Video Access</li>
                <li>✓ E-Certificate upon completion</li>
              </ul>
              <Link href="/register?mode=online" className="btn btn-primary w-full text-center" style={{ display: 'block' }}>
                Register for Online Learning 🚀
              </Link>
            </div>

            {/* Card 2: Register for In-Person Training */}
            <div className="glass padding-lg radius-lg hover-lift" style={{ borderRadius: '20px', border: '1px solid rgba(59, 130, 246, 0.3)', position: 'relative' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🏫</div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Register to Learn In-Person</h3>
              <p className="text-muted" style={{ fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                Attend interactive physical classes with certified instructors at our modern campuses in Addis Ababa or Bahir Dar.
              </p>
              
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.85rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.84rem', lineHeight: '1.5' }}>
                <p style={{ margin: '0 0 0.4rem 0' }}>📍 <strong>Addis Ababa Campus:</strong> Megenagna Metebaber Bldg, 5th Fl (Rm #513) & 7th Fl</p>
                <p style={{ margin: 0 }}>📍 <strong>Bahir Dar Campus:</strong> Millennium Bldg 1st Fl & 7th Fl (Next to Signal Mall)</p>
              </div>

              <Link href="/register?mode=in_person" className="btn btn-secondary w-full text-center" style={{ display: 'block' }}>
                Register for In-Person Training 🏫
              </Link>
            </div>
          </div>

          {/* Quick Hotline & Direct WhatsApp Booking */}
          <div className="quick-hotline-box glass padding-md radius-lg text-center">
            <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>Prefer direct registration via phone or WhatsApp?</span>
            <div className="quick-hotline-btns">
              <a href="tel:+251989795758" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>📞 Call +251 989 795 758</a>
              <a href="https://wa.me/251977787358?text=Hello!%20I%20want%20to%20register%20for%20In-Person%20training%20at%20Horizon%20Center." target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>💬 WhatsApp Direct Booking</a>
            </div>
          </div>
        </div>
      </section>

      {/* About Snippet */}
      <section className="about-snippet container">
        <div className="about-grid">
          <div className="about-text glass">
            <h2>{t('aboutSnippet.title')} <span className="text-gradient">{t('aboutSnippet.horizon')}</span></h2>
            <p>
              {t('aboutSnippet.description')}
            </p>
            <div className="metrics">
              <div className="metric">
                <h3>5+</h3>
                <p>{t('aboutSnippet.expYears')}</p>
              </div>
              <div className="metric">
                <h3>2000+</h3>
                <p>{t('aboutSnippet.students')}</p>
              </div>
              <div className="metric">
                <h3>24/7</h3>
                <p>Support & Access</p>
              </div>
            </div>
            <Link href="/about" className="btn btn-outline" style={{ marginTop: '1rem' }}>{t('aboutSnippet.readStory')}</Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-us bg-secondary">
        <div className="container">
          <h2 className="section-title text-center">{t('whyChooseUs.title')}</h2>
          <div className="features-grid">
            {whyChooseUsFeatures.map((feature, idx) => (
              <div key={idx} className="feature-card glass">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3>{feature}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="featured-courses container">
        <h2 className="section-title text-center">{t('featuredPrograms.title')}</h2>
        <div className="courses-grid">
          <div className="course-card glass">
            <div className="course-image bg-orange"></div>
            <div className="course-content">
              <h3>{t('featuredPrograms.programs.spoken.title')}</h3>
              <p>{t('featuredPrograms.programs.spoken.desc')}</p>
              <Link href="/courses" className="btn btn-primary mt-4">{t('featuredPrograms.learnMore')}</Link>
            </div>
          </div>
          <div className="course-card glass">
            <div className="course-image bg-blue"></div>
            <div className="course-content">
              <h3>{t('featuredPrograms.programs.ielts.title')}</h3>
              <p>{t('featuredPrograms.programs.ielts.desc')}</p>
              <Link href="/courses" className="btn btn-primary mt-4">{t('featuredPrograms.learnMore')}</Link>
            </div>
          </div>
          <div className="course-card glass">
            <div className="course-image bg-teal"></div>
            <div className="course-content">
              <h3>{t('featuredPrograms.programs.computer.title')}</h3>
              <p>{t('featuredPrograms.programs.computer.desc')}</p>
              <Link href="/courses" className="btn btn-primary mt-4">{t('featuredPrograms.learnMore')}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Specialized Test Prep, Interview & Speaking Skills Showcase */}
      <section className="gallery-section bg-secondary padding-lg">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Specialized Certifications & Interview Coaching</h2>
            <p className="text-muted max-w-lg mx-auto" style={{ fontSize: '1rem', marginTop: '0.5rem' }}>
              We prepare students for international proficiency exams (IELTS, TOEFL iBT, Duolingo, OET) and professional career interviews.
            </p>
          </div>

          <div className="gallery-grid">
            {/* Poster 1: Test Prep & Interviews */}
            <div className="glass padding-md radius-lg overflow-hidden hover-lift" style={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div className="gallery-card-img-wrap">
                <Image
                  src="/gallery/poster-test-prep.jpg"
                  alt="IELTS, TOEFL iBT, Duolingo, Embassy & Job Interview Prep Poster"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'top' }}
                />
              </div>
              <div style={{ padding: '1rem 0.25rem 0.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)' }}>Test Prep & Interview Coaching</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: '1.5', marginTop: '0.4rem' }}>
                  IELTS, TOEFL iBT, Duolingo, OET, Embassy Interview, Aviation, Job & Hotel Interviews. Available In-Person, Online, Group, & VIP One-on-One.
                </p>
              </div>
            </div>

            {/* Poster 2: Speaking Skills */}
            <div className="glass padding-md radius-lg overflow-hidden hover-lift" style={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div className="gallery-card-img-wrap">
                <Image
                  src="/gallery/poster-speaking-skills.jpg"
                  alt="Free Talk, Debating, Stage Handling, Pronunciation & Presentation"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'top' }}
                />
              </div>
              <div style={{ padding: '1rem 0.25rem 0.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)' }}>Advanced Spoken Mastery</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: '1.5', marginTop: '0.4rem' }}>
                  Free Talk sessions, Debating, Stage Handling, Pronunciation training, and Professional Presentation confidence.
                </p>
              </div>
            </div>

            {/* Poster 3: Always Open Banner */}
            <div className="glass padding-md radius-lg overflow-hidden hover-lift" style={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div className="gallery-card-img-wrap">
                <Image
                  src="/gallery/poster-always-open.jpg"
                  alt="Always Open Registration and Ongoing Classes"
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'top' }}
                />
              </div>
              <div style={{ padding: '1rem 0.25rem 0.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)' }}>Ongoing Enrollment (24/7)</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: '1.5', marginTop: '0.4rem' }}>
                  Flexible class schedules for beginners, intermediate, and advanced learners. Always open registration!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder & Leadership Spotlight */}
      <section className="founder-spotlight container">
        <div className="glass padding-lg radius-lg founder-grid">
          <div className="founder-avatar">
            GM
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-primary)', fontWeight: 'bold' }}>Founder & General Manager</span>
            <h2 style={{ margin: '0.2rem 0 0.5rem 0' }}>Getachew Marie Bogale</h2>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>
              Experienced and Certified English Teacher | Network Engineer | Computer Scientist. Leading Horizon Center with a commitment to transformative education, practical communication, and digital empowerment across Ethiopia.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof & Testimonials */}
      <section className="testimonials bg-secondary">
        <div className="container">
          <h2 className="section-title text-center">{t('successStories.title')}</h2>
          <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
            {Array.isArray(testimonialList) && testimonialList.map((item, idx) => (
              <div key={idx} className="testimonial-card glass padding-lg radius-lg">
                <p className="testimonial-text" style={{ fontStyle: 'italic', marginBottom: '1rem' }}>"{item.quote}"</p>
                <p className="testimonial-author text-primary" style={{ fontWeight: 'bold', margin: 0 }}>— {item.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="cta-section text-center">
        <div className="container">
          <h2>{t('cta.title')}</h2>
          <p>{t('cta.subtitle')}</p>
          <Link href="/register" className="btn btn-primary" style={{ marginTop: '2rem' }}>{t('cta.registerToday')}</Link>
        </div>
      </section>
    </div>
  );
}



'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/components/LanguageContext';
import './page.css';

export default function Home() {
  const { t, locale } = useTranslation();

  // Interactive Filter & Accordion States
  const [activeCategory, setActiveCategory] = useState('all');
  const [showComparison, setShowComparison] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const whyChooseUsFeatures = t('whyChooseUs.features') || [];
  const testimonialList = t('successStories.list') || [];
  const faqItems = t('faq.items') || [];
  const comparisonFeatures = t('comparison.features') || [];

  // Clean Course Catalog
  const coursesCatalog = [
    {
      id: 'spoken-english',
      category: 'spoken',
      title: t('featuredPrograms.programs.spoken.title'),
      desc: t('featuredPrograms.programs.spoken.desc'),
      level: locale === 'am' ? 'ጀማሪ፣ መካከለኛ እና የላቀ' : 'Beginner to Advanced',
      duration: '3 Months',
      rating: '4.9',
      reviews: '1,240',
      badge: 'Certificate',
      skills: ['Spoken Fluency', 'Accent Reduction', 'Public Speaking'],
      bgClass: 'bg-orange',
      href: '/courses'
    },
    {
      id: 'ielts-prep',
      category: 'ielts',
      title: t('featuredPrograms.programs.ielts.title'),
      desc: t('featuredPrograms.programs.ielts.desc'),
      level: locale === 'am' ? 'መካከለኛ እና የላቀ' : 'Target Band 7.5+',
      duration: '2 Months',
      rating: '4.95',
      reviews: '890',
      badge: 'Specialization',
      skills: ['Academic Writing', 'Listening Mastery', 'Speaking Band 8'],
      bgClass: 'bg-blue',
      href: '/courses'
    },
    {
      id: 'computer-it',
      category: 'computer',
      title: t('featuredPrograms.programs.computer.title'),
      desc: t('featuredPrograms.programs.computer.desc'),
      level: locale === 'am' ? 'መሰረታዊ እስከ ላቀ' : 'Comprehensive IT',
      duration: '1-3 Months',
      rating: '4.85',
      reviews: '740',
      badge: 'Job Credential',
      skills: ['Digital Literacy', 'MS Office Suite', 'Networking Basics'],
      bgClass: 'bg-teal',
      href: '/courses'
    },
    {
      id: 'pronunciation-mastery',
      category: 'spoken',
      title: locale === 'am' ? 'የአነባበብ እና የንግግር ጥራት' : 'Pronunciation & Voice Mastery',
      desc: locale === 'am' ? 'ተፈጥሯዊ እና በራስ መተማመን የተሞላ የእንግሊዝኛ የድምፅ አወጣጥ እና ሪትም ማዳበር።' : 'Sound natural, confident, and articulate by mastering English phonetic rhythm and stress.',
      level: locale === 'am' ? 'ለሁሉም ደረጃዎች' : 'All Levels',
      duration: '6 Weeks',
      rating: '4.9',
      reviews: '520',
      badge: 'Skill Badge',
      skills: ['Phonetics', 'Intonation', 'Free Talk'],
      bgClass: 'bg-purple',
      href: '/courses'
    },
    {
      id: 'toefl-duolingo',
      category: 'ielts',
      title: locale === 'am' ? 'TOEFL iBT እና Duolingo ፈተና ዝግጅት' : 'TOEFL iBT & Duolingo Intensive',
      desc: locale === 'am' ? 'ለአለም አቀፍ ዩኒቨርሲቲዎች እና የስኮላርሺፕ እድሎች ከፍተኛ ውጤት የማስመዝገቢያ ስልጠና።' : 'Targeted strategy drills, computer-adaptive mock tests, and timed response mastery.',
      level: locale === 'am' ? 'መካከለኛ/የላቀ' : 'Intermediate/Advanced',
      duration: '6 Weeks',
      rating: '4.92',
      reviews: '410',
      badge: 'Exam Track',
      skills: ['Adaptive Testing', 'Integrated Writing', 'Rapid Speaking'],
      bgClass: 'bg-green',
      href: '/courses'
    },
    {
      id: 'networking-support',
      category: 'computer',
      title: locale === 'am' ? 'የኮምፒውተር ኔትወርክ እና ሃርድዌር' : 'Networking & Computer Maintenance',
      desc: locale === 'am' ? 'የቢሮ እና የድርጅት ኔትወርክ ዝርጋታ፣ ጥገና እና የሳይበር ደህንነት መሰረታዊ ስልጠና።' : 'Hands-on hardware troubleshooting, local network configuration, and enterprise IT basics.',
      level: locale === 'am' ? 'ተግባራዊ IT' : 'Practical Hands-on',
      duration: '2 Months',
      rating: '4.88',
      reviews: '360',
      badge: 'Certificate',
      skills: ['LAN Configuration', 'PC Maintenance', 'IT Support'],
      bgClass: 'bg-teal',
      href: '/courses'
    }
  ];

  const filteredCourses = activeCategory === 'all'
    ? coursesCatalog
    : coursesCatalog.filter(c => c.category === activeCategory);

  return (
    <div className="home-page coursera-simple-page">
      {/* =========================================================================
          Coursera-Style Solid Hero Banner
          ========================================================================= */}
      <section className="coursera-hero-section">
        <div className="container">
          <div className="coursera-hero-card">
            {/* Left Column: Text & Actions */}
            <div className="coursera-hero-text">
              {/* Brand Logo Mark */}
              <div className="coursera-brand-mark">
                <span className="brand-name">horizon</span>
                <span className="brand-plus-box">PLUS</span>
              </div>

              {/* Bold 2-Line Headline */}
              <h1 className="coursera-hero-heading">
                {t('hero.courseraHeadline1')}<br />
                {t('hero.courseraHeadline2')}
              </h1>

              {/* Concise Subtitle */}
              <p className="coursera-hero-desc">
                {t('hero.courseraSubtitle')}
              </p>

              {/* Solid White CTA Button & Secondary In-Person Link */}
              <div className="coursera-hero-action-row">
                <Link href="/register" className="btn-coursera-white">
                  {t('hero.startFreeTrial')} 🚀
                </Link>
                <Link href="/register?mode=in_person" className="coursera-hero-link">
                  {t('hero.inPersonLink')} →
                </Link>
              </div>
            </div>

            {/* Right Column: Clean Student Cutout with Soft Arch */}
            <div className="coursera-hero-media">
              <div className="coursera-student-frame">
                <Image
                  src="/hero-student.jpg"
                  alt="Horizon Center Student"
                  width={460}
                  height={460}
                  className="coursera-student-img"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          Concept: Learning on Horizon (Online or In-Person)
          Replaces the foreign tech logos with 100% relevant Horizon learning features
          ========================================================================= */}
      <section className="coursera-partners-section">
        <div className="container">
          <div className="learning-concept-header">
            <h2 className="coursera-partners-title">
              {t('learningConcept.title')}
            </h2>
            <p className="learning-concept-subtitle text-muted">
              {t('learningConcept.subtitle')}
            </p>
          </div>

          <div className="coursera-partners-row">
            <Link href="/register?mode=online" className="coursera-partner-chip">
              <span className="partner-logo-circle">💻</span>
              <span className="partner-chip-name">{t('learningConcept.chips.online')}</span>
            </Link>
            <Link href="/register?mode=in_person" className="coursera-partner-chip">
              <span className="partner-logo-circle">📍</span>
              <span className="partner-chip-name">{t('learningConcept.chips.addis')}</span>
            </Link>
            <Link href="/register?mode=in_person" className="coursera-partner-chip">
              <span className="partner-logo-circle">📍</span>
              <span className="partner-chip-name">{t('learningConcept.chips.bahirDar')}</span>
            </Link>
            <Link href="/courses" className="coursera-partner-chip">
              <span className="partner-logo-circle">🗣️</span>
              <span className="partner-chip-name">{t('learningConcept.chips.speaking')}</span>
            </Link>
            <Link href="/courses" className="coursera-partner-chip">
              <span className="partner-logo-circle">🎯</span>
              <span className="partner-chip-name">{t('learningConcept.chips.ielts')}</span>
            </Link>
            <Link href="/about" className="coursera-partner-chip">
              <span className="partner-logo-circle">📜</span>
              <span className="partner-chip-name">{t('learningConcept.chips.certificate')}</span>
            </Link>
            <Link href="/register" className="coursera-partner-chip">
              <span className="partner-logo-circle">⏰</span>
              <span className="partner-chip-name">{t('learningConcept.chips.flexible')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          Course Catalog with Coursera-Style Category Navigation Pills
          ========================================================================= */}
      <section className="coursera-catalog-section">
        <div className="container">
          {/* Coursera-Style Clean Category Pill Bar */}
          <div className="coursera-category-bar-wrapper">
            <div className="coursera-category-bar">
              <button
                onClick={() => setActiveCategory('all')}
                className={`coursera-cat-pill ${activeCategory === 'all' ? 'active' : ''}`}
              >
                {t('catalog.filterAll')}
              </button>
              <button
                onClick={() => setActiveCategory('spoken')}
                className={`coursera-cat-pill ${activeCategory === 'spoken' ? 'active' : ''}`}
              >
                {t('catalog.filterSpoken')}
              </button>
              <button
                onClick={() => setActiveCategory('ielts')}
                className={`coursera-cat-pill ${activeCategory === 'ielts' ? 'active' : ''}`}
              >
                {t('catalog.filterIelts')}
              </button>
              <button
                onClick={() => setActiveCategory('computer')}
                className={`coursera-cat-pill ${activeCategory === 'computer' ? 'active' : ''}`}
              >
                {t('catalog.filterComputer')}
              </button>
            </div>
          </div>

          {/* Simple Course Cards Grid */}
          <div className="courses-grid" style={{ marginTop: '2rem' }}>
            {filteredCourses.map((course) => (
              <div key={course.id} className="coursera-course-card glass hover-lift">
                <div className={`coursera-course-header ${course.bgClass}`}>
                  <span className="course-badge-pill">{course.badge}</span>
                  <span className="course-dur-pill">{course.duration}</span>
                </div>
                <div className="coursera-course-body">
                  <div className="course-meta-row">
                    <span className="star-rating">⭐ {course.rating}</span>
                    <span className="review-count">({course.reviews})</span>
                    <span className="course-level-pill">{course.level}</span>
                  </div>
                  <h3 className="course-heading">{course.title}</h3>
                  <p className="course-desc">{course.desc}</p>

                  <div className="coursera-skills-row">
                    {course.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="skill-pill">{skill}</span>
                    ))}
                  </div>

                  <div className="coursera-card-bottom">
                    <span className="cert-check-text">✓ {t('catalog.certificateBadge')}</span>
                    <Link href={course.href} className="btn-card-learn">
                      {t('featuredPrograms.learnMore')} →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          Registration Section (Online & In-Person Simple Cards)
          ========================================================================= */}
      <section className="coursera-register-section bg-secondary">
        <div className="container">
          <div className="text-center mb-4">
            <span className="section-pill-tag">🎓 {t('comparison.badge')}</span>
            <h2 className="section-title" style={{ margin: '0.25rem 0 0.5rem 0' }}>
              Register to Learn <span className="text-gradient">Online</span> or <span className="text-gradient">In-Person</span>
            </h2>
            <p className="text-muted max-w-lg mx-auto" style={{ fontSize: '1rem', margin: '0 auto 1.25rem auto' }}>
              {t('comparison.subtitle')}
            </p>

            <button
              onClick={() => setShowComparison(!showComparison)}
              className="btn btn-outline btn-sm comparison-toggle-btn"
              aria-expanded={showComparison}
            >
              {showComparison ? '✕ Close Comparison' : '⚖️ ' + t('comparison.tableTitle')}
            </button>
          </div>

          {/* Comparison Matrix Table */}
          {showComparison && (
            <div className="comparison-table-wrapper glass radius-lg mb-5 animate-fade-in">
              <div className="comparison-table-header">
                <h3>{t('comparison.tableTitle')}</h3>
              </div>
              <div className="table-responsive">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>{t('comparison.featureHeader')}</th>
                      <th className="highlight-online">{t('comparison.onlineHeader')}</th>
                      <th className="highlight-inperson">{t('comparison.inPersonHeader')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feat, idx) => (
                      <tr key={idx}>
                        <td className="feat-name">{feat.name}</td>
                        <td className="feat-val"><span className="check-mark">✓</span> {feat.online}</td>
                        <td className="feat-val"><span className="check-mark">✓</span> {feat.inPerson}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="registration-grid">
            {/* Card 1: Online */}
            <div className="registration-card glass padding-lg radius-lg highlight-card-online">
              <div className="card-top-pill">
                <span>⚡ {t('comparison.onlineBadge')}</span>
              </div>
              <div className="card-emoji-header">💻</div>
              <h3 className="card-title">Register for Online Learning</h3>
              <p className="text-muted card-description">
                Study from anywhere in Ethiopia or abroad! Access interactive video lessons, live Zoom speaking sessions, digital materials, and quizzes.
              </p>
              <ul className="card-feature-list">
                <li><span className="feature-check">✓</span> Live Spoken English & Zoom practice</li>
                <li><span className="feature-check">✓</span> 24/7 Portal & Video Lesson Access</li>
                <li><span className="feature-check">✓</span> E-Certificate & Digital Credential</li>
              </ul>
              <Link href="/register?mode=online" className="btn btn-primary w-full text-center card-cta-btn">
                Register for Online Learning 🚀
              </Link>
            </div>

            {/* Card 2: In-Person */}
            <div className="registration-card glass padding-lg radius-lg highlight-card-inperson">
              <div className="card-top-pill inperson-pill">
                <span>🏫 {t('comparison.inPersonBadge')}</span>
              </div>
              <div className="card-emoji-header">🏫</div>
              <h3 className="card-title">Register to Learn In-Person</h3>
              <p className="text-muted card-description">
                Attend interactive physical classes with certified instructors at our modern campuses in Addis Ababa or Bahir Dar.
              </p>
              <div className="campus-location-box">
                <p>📍 <strong>Addis Ababa:</strong> Megenagna Metebaber Bldg, 5th Fl (Rm #513) & 7th Fl</p>
                <p>📍 <strong>Bahir Dar:</strong> Millennium Bldg 1st Fl & 7th Fl (Next to Signal Mall)</p>
              </div>
              <Link href="/register?mode=in_person" className="btn btn-secondary w-full text-center card-cta-btn">
                Register for In-Person Training 🏫
              </Link>
            </div>
          </div>

          {/* Direct Hotline / WhatsApp */}
          <div className="quick-hotline-box glass padding-md radius-lg text-center">
            <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>Prefer direct registration via phone or WhatsApp?</span>
            <div className="quick-hotline-btns">
              <a href="tel:+251989795758" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                📞 Call +251 989 795 758
              </a>
              <a href="https://wa.me/251977787358?text=Hello!%20I%20want%20to%20register%20for%20In-Person%20training%20at%20Horizon%20Center." target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                💬 WhatsApp Direct Booking
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          About Horizon Academy
          ========================================================================= */}
      <section className="about-snippet container">
        <div className="about-text glass">
          <span className="section-pill-tag">✦ ACADEMY OVERVIEW</span>
          <h2 style={{ marginTop: '0.35rem' }}>
            {t('aboutSnippet.title')} <span className="text-gradient">{t('aboutSnippet.horizon')}</span>
          </h2>
          <p style={{ marginTop: '0.85rem', fontSize: '1.02rem', lineHeight: '1.65' }}>
            {t('aboutSnippet.description')}
          </p>
          <div className="metrics">
            <div className="metric">
              <h3>5+</h3>
              <p>{t('aboutSnippet.expYears')}</p>
            </div>
            <div className="metric">
              <h3>2,000+</h3>
              <p>{t('aboutSnippet.students')}</p>
            </div>
            <div className="metric">
              <h3>24/7</h3>
              <p>Support & Access</p>
            </div>
            <div className="metric">
              <h3>100%</h3>
              <p>Certified Teachers</p>
            </div>
          </div>
          <Link href="/about" className="btn btn-outline" style={{ marginTop: '1.25rem' }}>
            {t('aboutSnippet.readStory')} →
          </Link>
        </div>
      </section>

      {/* =========================================================================
          Why Choose Us
          ========================================================================= */}
      <section className="why-choose-us bg-secondary">
        <div className="container">
          <div className="text-center mb-4">
            <span className="section-pill-tag">⭐ {t('whyChooseUs.title')}</span>
            <h2 className="section-title" style={{ marginTop: '0.35rem' }}>
              Why Students & Professionals Choose Horizon
            </h2>
          </div>
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

      {/* =========================================================================
          Specialized Certifications Posters
          ========================================================================= */}
      <section className="gallery-section container">
        <div className="text-center mb-4">
          <span className="section-pill-tag">🎯 SPECIALIZED TRACKS</span>
          <h2 className="section-title" style={{ marginTop: '0.35rem' }}>
            Specialized Certifications & Interview Coaching
          </h2>
        </div>
        <div className="gallery-grid">
          <div className="gallery-card glass padding-md radius-lg overflow-hidden hover-lift">
            <div className="gallery-card-img-wrap">
              <Image src="/gallery/poster-test-prep.jpg" alt="Test Prep & Interviews" fill style={{ objectFit: 'cover' }} />
            </div>
            <div className="gallery-card-info">
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)' }}>Test Prep & Interview Coaching</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                IELTS, TOEFL iBT, Duolingo, OET, Embassy Interview, Aviation & Job Interviews.
              </p>
            </div>
          </div>

          <div className="gallery-card glass padding-md radius-lg overflow-hidden hover-lift">
            <div className="gallery-card-img-wrap">
              <Image src="/gallery/poster-speaking-skills.jpg" alt="Speaking Skills" fill style={{ objectFit: 'cover' }} />
            </div>
            <div className="gallery-card-info">
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)' }}>Advanced Spoken Mastery</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                Free Talk sessions, Debating, Stage Handling, and Pronunciation training.
              </p>
            </div>
          </div>

          <div className="gallery-card glass padding-md radius-lg overflow-hidden hover-lift">
            <div className="gallery-card-img-wrap">
              <Image src="/gallery/poster-always-open.jpg" alt="Always Open" fill style={{ objectFit: 'cover' }} />
            </div>
            <div className="gallery-card-info">
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)' }}>Ongoing Enrollment (24/7)</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                Flexible class schedules for beginners, intermediate, and advanced learners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          Founder Spotlight
          ========================================================================= */}
      <section className="founder-spotlight container">
        <div className="glass padding-lg radius-lg founder-grid">
          <div className="founder-avatar">GM</div>
          <div>
            <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-primary)', fontWeight: 'bold' }}>Founder & General Manager</span>
            <h2 style={{ margin: '0.2rem 0 0.5rem 0' }}>Getachew Marie Bogale</h2>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>
              Experienced and Certified English Teacher | Network Engineer | Computer Scientist. Leading Horizon Center with a commitment to transformative education, practical communication, and digital empowerment across Ethiopia.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          Testimonials (Learner Outcomes)
          ========================================================================= */}
      <section className="testimonials bg-secondary">
        <div className="container">
          <div className="text-center mb-4">
            <span className="section-pill-tag">💬 LEARNER STORIES</span>
            <h2 className="section-title" style={{ marginTop: '0.35rem' }}>
              {t('successStories.title')}
            </h2>
          </div>
          <div className="testimonials-grid">
            {testimonialList.map((item, idx) => (
              <div key={idx} className="testimonial-card glass padding-lg radius-lg">
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">"{item.quote}"</p>
                <div className="testimonial-author-row">
                  <div className="author-avatar-chip">{item.author[0]}</div>
                  <div>
                    <p className="testimonial-author">{item.author}</p>
                    <span className="testimonial-verified">✓ Verified Horizon Graduate</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          FAQ Accordion
          ========================================================================= */}
      <section className="faq-section container">
        <div className="text-center mb-5">
          <span className="section-pill-tag">❓ {t('faq.badge')}</span>
          <h2 className="section-title" style={{ marginTop: '0.35rem' }}>
            {t('faq.title')}
          </h2>
          <p className="text-muted max-w-lg mx-auto" style={{ fontSize: '1rem', marginTop: '0.5rem' }}>
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="faq-accordion-list max-w-lg mx-auto">
          {faqItems.map((item, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className={`faq-accordion-item glass radius-md ${isOpen ? 'faq-item-open' : ''}`}>
                <button
                  onClick={() => toggleFaq(idx)}
                  className="faq-question-btn"
                  aria-expanded={isOpen}
                >
                  <span className="faq-question-text">{item.q}</span>
                  <span className="faq-chevron-icon">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="faq-answer-content animate-fade-in">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          CTA Section
          ========================================================================= */}
      <section className="cta-section text-center">
        <div className="container">
          <h2>{t('cta.title')}</h2>
          <p style={{ maxWidth: '640px', margin: '0.5rem auto 1.5rem auto' }}>{t('cta.subtitle')}</p>
          <div className="cta-actions-row">
            <Link href="/register" className="btn btn-primary btn-lg">
              {t('cta.registerToday')} 🚀
            </Link>
            <Link href="/courses" className="btn btn-outline btn-lg">
              {t('hero.exploreCourses')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';
import Link from 'next/link';
import { useTranslation } from '@/components/LanguageContext';
import './page.css';

export default function Home() {
  const { t } = useTranslation();

  // Handle arrays gracefully by checking translation type or loading fallback arrays
  const whyChooseUsFeatures = t('whyChooseUs.features') || [];

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
                <h3>10k+</h3>
                <p>{t('aboutSnippet.students')}</p>
              </div>
              <div className="metric">
                <h3>3</h3>
                <p>{t('aboutSnippet.languages')}</p>
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
                <div className="feature-icon">✓</div>
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
            <div className="course-image bg-green"></div>
            <div className="course-content">
              <h3>{t('featuredPrograms.programs.kids.title')}</h3>
              <p>{t('featuredPrograms.programs.kids.desc')}</p>
              <Link href="/courses" className="btn btn-primary mt-4">{t('featuredPrograms.learnMore')}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials bg-secondary">
        <div className="container">
          <h2 className="section-title text-center">{t('successStories.title')}</h2>
          <div className="testimonial-card glass">
            <p className="testimonial-text">{t('successStories.quote')}</p>
            <p className="testimonial-author">{t('successStories.author')}</p>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="cta-section text-center">
        <div className="container">
          <h2>{t('cta.title')}</h2>
          <p>{t('cta.subtitle')}</p>
          <Link href="/login" className="btn btn-primary" style={{ marginTop: '2rem' }}>{t('cta.registerToday')}</Link>
        </div>
      </section>
    </div>
  );
}


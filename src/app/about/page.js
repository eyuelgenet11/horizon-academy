import './page.css';
import Image from 'next/image';

export default function AboutUs() {
  const whyChooseUsList = [
    "Experienced and qualified instructors",
    "Practical, interactive learning approach",
    "Modern teaching materials and technology",
    "Flexible class schedules",
    "Small and personalized classes",
    "Affordable training programs",
    "Certificate upon successful completion",
    "Supportive learning environment"
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero text-center">
        <div className="container animate-fade-in">
          <h1 className="section-title">About <span className="text-gradient">Horizon Center</span></h1>
          <p className="hero-subtitle mx-auto">
            Horizon Center of Foreign Languages and Computer Training Center is a leading educational institution in Ethiopia dedicated to empowering individuals through quality language education and practical computer skills training.
          </p>
        </div>
      </section>

      {/* Academy Statistics Counter */}
      <section className="container mb-5">
        <div className="glass padding-lg radius-lg text-center" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          <div>
            <h2 className="text-gradient" style={{ fontSize: '3rem', margin: 0 }}>2000+</h2>
            <p className="text-muted" style={{ fontWeight: '600', marginTop: '0.25rem' }}>Total Students Trained</p>
          </div>
          <div>
            <h2 className="text-gradient" style={{ fontSize: '3rem', margin: 0 }}>5+</h2>
            <p className="text-muted" style={{ fontWeight: '600', marginTop: '0.25rem' }}>Years of Experience</p>
          </div>
          <div>
            <h2 className="text-gradient" style={{ fontSize: '3rem', margin: 0 }}>24/7</h2>
            <p className="text-muted" style={{ fontWeight: '600', marginTop: '0.25rem' }}>Office & Learning Access</p>
          </div>
          <div>
            <h2 className="text-gradient" style={{ fontSize: '3rem', margin: 0 }}>2</h2>
            <p className="text-muted" style={{ fontWeight: '600', marginTop: '0.25rem' }}>Main Campuses (Addis Ababa & Bahir Dar)</p>
          </div>
        </div>
      </section>

      {/* About Us & Mission / Vision */}
      <section className="story-mission container">
        <div className="content-grid">
          <div className="glass padding-lg radius-lg">
            <h2 className="text-primary mb-4">About Us</h2>
            <p style={{ lineHeight: '1.8' }}>
              Horizon Center of Foreign Languages and Computer Training Center is a leading educational institution in Ethiopia dedicated to empowering individuals through quality language education and practical computer skills training. We provide professional, student-centered instruction that equips learners with the communication and digital competencies needed to succeed in education, employment, business, and everyday life.
            </p>
            <p style={{ lineHeight: '1.8', marginTop: '1rem' }}>
              Our programs are designed for students, professionals, job seekers, and organizations seeking high-quality training in a supportive and engaging learning environment.
            </p>
          </div>
          <div className="glass padding-lg radius-lg bg-secondary">
            <h2 className="text-primary mb-4">Mission & Vision</h2>
            <div className="mb-4">
              <h3 style={{ color: 'var(--color-primary)' }}>Our Mission</h3>
              <p style={{ lineHeight: '1.7' }}>
                To empower individuals by providing high-quality foreign language education and practical computer skills training that foster confidence, lifelong learning, professional excellence, and global opportunities. We are committed to delivering innovative, accessible, and learner-centered education that prepares our students to succeed in an increasingly connected and technology-driven world.
              </p>
            </div>
            <div>
              <h3 style={{ color: 'var(--color-primary)' }}>Our Vision</h3>
              <p style={{ lineHeight: '1.7' }}>
                To become Ethiopia's most trusted and innovative center for foreign language education and computer training, recognized for academic excellence, transformative learning, and producing graduates who confidently compete and contribute both nationally and internationally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose bg-secondary padding-lg" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
        <div className="container text-center">
          <h2 className="section-title">Why Choose Us?</h2>
          <div className="values-grid mt-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {whyChooseUsList.map((item, idx) => (
              <div key={idx} className="value-card glass padding-lg radius-lg">
                <div className="value-icon" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>✨</div>
                <h3 style={{ fontSize: '1rem', lineHeight: '1.4' }}>{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership / Founder Profile */}
      <section className="team container text-center mb-5">
        <h2 className="section-title">Leadership & Founder</h2>
        <p className="mb-5 text-muted max-w-lg mx-auto">Dedicated management and expert instruction driving educational excellence.</p>
        <div className="team-grid" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="team-member glass padding-lg radius-lg" style={{ maxWidth: '480px', width: '100%' }}>
            <div className="avatar mx-auto mb-4 bg-orange" style={{ width: '90px', height: '90px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#fff', fontWeight: 'bold' }}>
              GM
            </div>
            <h3 style={{ fontSize: '1.4rem' }}>Getachew Marie Bogale</h3>
            <p className="text-primary" style={{ fontWeight: 'bold', marginBottom: '0.75rem' }}>Founder and General Manager</p>
            <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              Experienced and Certified English Teacher | Network Engineer | Computer Scientist
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}


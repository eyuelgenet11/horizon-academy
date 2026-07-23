import './page.css';
import Image from 'next/image';

export default function AboutUs() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero text-center">
        <div className="container animate-fade-in">
          <h1 className="section-title">About <span className="text-gradient">Horizon</span></h1>
          <p className="hero-subtitle mx-auto">Empowering individuals through language education and practical communication skills.</p>
        </div>
      </section>

      {/* Our Story & Mission */}
      <section className="story-mission container">
        <div className="content-grid">
          <div className="glass padding-lg radius-lg">
            <h2 className="text-primary mb-4">Our Story</h2>
            <p>
              Horizon Foreign Languages Academy started with a simple idea: language learning should be practical, engaging, and focused on real-world communication. We saw many students struggling with traditional grammar-heavy methods and decided to create an environment where learners actively speak and practice from day one.
            </p>
          </div>
          <div className="glass padding-lg radius-lg bg-secondary">
            <h2 className="text-primary mb-4">Mission & Vision</h2>
            <div className="mb-4">
              <h3>Our Mission</h3>
              <p>To empower individuals through language education and practical communication skills.</p>
            </div>
            <div>
              <h3>Our Vision</h3>
              <p>To become one of Ethiopia's leading language training institutions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="core-values bg-secondary">
        <div className="container text-center">
          <h2 className="section-title">Our Core Values</h2>
          <div className="values-grid">
            {['Excellence', 'Integrity', 'Respect', 'Innovation', 'Student Success'].map((value, idx) => (
              <div key={idx} className="value-card glass">
                <div className="value-icon">⭐</div>
                <h3>{value}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="team container text-center">
        <h2 className="section-title">Meet the Team</h2>
        <p className="mb-5 text-muted max-w-lg mx-auto">Our dedicated team of professionals and language trainers.</p>
        <div className="team-grid">
          {/* Mock Team Members */}
          {[
            { name: "Gech Marie", role: "Founder / General Manager" },
            { name: "Sarah K.", role: "Lead English Trainer" },
            { name: "Dawit M.", role: "Student Coordinator" },
          ].map((member, idx) => (
            <div key={idx} className="team-member glass padding-lg radius-lg">
              <div className="avatar mx-auto mb-4 bg-orange"></div>
              <h3>{member.name}</h3>
              <p className="text-primary">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

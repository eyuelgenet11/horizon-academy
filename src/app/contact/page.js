'use client';
import { useState } from 'react';
import './page.css';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setStatus(res.ok ? 'success' : 'error');
    if (res.ok) setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page">
      {/* Hero */}
      <section className="contact-hero text-center">
        <div className="container animate-fade-in">
          <h1 className="section-title">
            Get in <span className="text-gradient">Touch</span>
          </h1>
          <p className="hero-subtitle mx-auto">
            Have a question about our courses? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Info + Form */}
      <section className="contact-body container">
        <div className="contact-grid">

          {/* Info Cards */}
          <div className="contact-info">
            <div className="info-card glass">
              <div className="info-icon">📍</div>
              <div>
                <h3>Physical Campuses & Office Locations</h3>
                <p style={{ marginTop: '0.4rem' }}>
                  <strong>Addis Ababa Campus:</strong><br />
                  Megenagna Metebaber Building, 5th Floor, Room #513 & 7th Floor<br />
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-primary)' }}>(መገናኛ - መተባበር ህንፃ 5ኛ ፎቅ/ቢ.ቁ 513)</span>
                </p>
                <p style={{ marginTop: '0.6rem' }}>
                  <strong>Bahir Dar Campus:</strong><br />
                  Around Papyrus, Next to Signal Mall, Millennium Building 1st Floor & 7th Floor<br />
                  <span style={{ fontSize: '0.82rem', color: 'var(--color-primary)' }}>(ባሕር ዳር - ገበያ ሲግናል ሞል ጎን ሚሊኒየም ህንፃ 1ኛ ፎቅ)</span>
                </p>
              </div>
            </div>
            <div className="info-card glass">
              <div className="info-icon">📞</div>
              <div>
                <h3>Phone Numbers</h3>
                <p><a href="tel:+251989795758">+251 989 795 758</a></p>
                <p style={{ marginTop: '0.2rem' }}><a href="tel:+251977785758">+251 977 785 758</a></p>
              </div>
            </div>
            <div className="info-card glass">
              <div className="info-icon">💬</div>
              <div>
                <h3>WhatsApp Business</h3>
                <a href="https://wa.me/251977787358" target="_blank" rel="noopener noreferrer">+251 977 787 358</a>
              </div>
            </div>
            <div className="info-card glass">
              <div className="info-icon">✉️</div>
              <div>
                <h3>Primary Contact Email</h3>
                <a href="mailto:gechhorizon16@gmail.com">gechhorizon16@gmail.com</a>
              </div>
            </div>
            <div className="info-card glass">
              <div className="info-icon">🕐</div>
              <div>
                <h3>Working / Office Hours</h3>
                <p><strong>24/7</strong> (Always open for student inquiries and online support)</p>
              </div>
            </div>

            {/* Dynamic Map embed */}
            <div className="map-iframe-container glass" style={{ padding: '1rem' }}>
              <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>📍 Google Maps Location</h4>
                <a
                  href="https://maps.app.goo.gl/SFhvjZTYpcrt16Rw7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}
                >
                  Open in Google Maps ↗
                </a>
              </div>
              <iframe
                title="Horizon Center of Foreign Languages and Computer Training Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5471928929766!2d38.7997!3d9.0185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b037a24d49!2sMegenagna%2C%20Addis%20Ababa!5e0!3m2!1sen!2set!4v1700000000000!5m2!1sen!2set"
                width="100%"
                height="220"
                style={{ border: 0, borderRadius: 'var(--radius-lg)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-wrapper glass">
            <h2>Send Us a Message</h2>

            {status === 'success' && (
              <div className="form-success">
                ✅ Your message has been sent! We&apos;ll respond within 24 hours.
              </div>
            )}
            {status === 'error' && (
              <div className="form-error">
                ❌ Something went wrong. Please try again or reach us via WhatsApp.
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input id="name" name="name" type="text" placeholder="Your name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone (optional)</label>
                  <input id="phone" name="phone" type="tel" placeholder="+251 9XX XXX XXX" value={form.phone} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input id="subject" name="subject" type="text" placeholder="What is this about?" value={form.subject} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group full">
                <label htmlFor="message">Message *</label>
                <textarea id="message" name="message" rows="5" placeholder="Write your message here…" value={form.message} onChange={handleChange} required />
              </div>

              <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}

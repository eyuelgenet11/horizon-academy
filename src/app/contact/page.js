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
                <h3>Our Location</h3>
                <p>Addis Ababa, Ethiopia</p>
              </div>
            </div>
            <div className="info-card glass">
              <div className="info-icon">📞</div>
              <div>
                <h3>Phone</h3>
                <a href="tel:+251911000000">+251 911 000 000</a>
              </div>
            </div>
            <div className="info-card glass">
              <div className="info-icon">✉️</div>
              <div>
                <h3>Email</h3>
                <a href="mailto:info@horizonacademy.et">info@horizonacademy.et</a>
              </div>
            </div>
            <div className="info-card glass">
              <div className="info-icon">🕐</div>
              <div>
                <h3>Working Hours</h3>
                <p>Monday – Saturday: 8AM – 6PM</p>
              </div>
            </div>

            {/* Dynamic Map embed */}
            <div className="map-iframe-container glass">
              <iframe
                title="Horizon Foreign Languages Academy Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126131.64205562817!2d38.706240212726715!3d9.01918342795493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b037a24d49!2sAddis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
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

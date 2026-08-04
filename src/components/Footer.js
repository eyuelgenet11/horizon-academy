import Link from 'next/link';
import Image from 'next/image';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-grid">

        <div className="footer-brand">
          <Link href="/" className="footer-logo" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
            <Image src="/logo.png" alt="Horizon Academy Logo" width={48} height={30} style={{ objectFit: 'contain' }} />
            <span><span className="text-gradient">Horizon</span> Center</span>
          </Link>
          <p className="footer-fullname">Horizon Center of Foreign Languages and Computer Training</p>
          <p className="footer-tagline">"Let Your Tongue Be Your Weapon"</p>
          <p className="footer-amharic">ሆራይዘን የውጭ ቋንቋዎችና ኮምፒውተር ስልጠና ማዕከል</p>
          <div className="footer-socials">
            <a href="https://www.tiktok.com/@horizon_english16?_r=1&_t=ZS-95cZXOTBX9g" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68a6.34 6.34 0 0 0 10.86 4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.54z"/></svg>
            </a>
            <a href="https://www.facebook.com/share/r/1BRzNyAWCz/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://youtube.com/@horizon_english16?si=QseMEwrVI2oG5ihh" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="https://www.instagram.com/reel/DXPMCarjI-R/?igsh=MTlkcjE5bHUycHBsag==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162S8.597 18.163 12 18.163s6.162-2.759 6.162-6.162S15.403 5.838 12 5.838zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="https://t.me/horizon_english16" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </a>
            <a href="https://www.linkedin.com/search/results/all/?keywords=Horizon%20Foreign%20Languages%20Academy" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/courses">Courses</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Programs</h4>
          <ul>
            <li><Link href="/courses">Spoken English</Link></li>
            <li><Link href="/courses">IELTS Preparation</Link></li>
            <li><Link href="/courses">Computer & IT Training</Link></li>
            <li><Link href="/courses">Foreign Languages</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact & Campuses</h4>
          <ul className="footer-contact">
            <li>📍 <strong>Addis Ababa:</strong> Megenagna Metebaber Bldg, 5th Fl (Rm 513) & 7th Fl</li>
            <li>📍 <strong>Bahir Dar:</strong> Next to Signal Mall, Millennium Bldg 1st Fl & 7th Fl</li>
            <li>🗺️ <a href="https://maps.app.goo.gl/SFhvjZTYpcrt16Rw7" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-light)', textDecoration: 'underline' }}>View on Google Maps 🗺️</a></li>
            <li>📞 <a href="tel:+251989795758">+251 989 795 758</a> / <a href="tel:+251977785758">+251 977 785 758</a></li>
            <li>💬 WhatsApp: <a href="https://wa.me/251977787358" target="_blank" rel="noopener noreferrer">+251 977 787 358</a></li>
            <li>✉️ <a href="mailto:gechhorizon16@gmail.com">gechhorizon16@gmail.com</a></li>
            <li>🕐 Working Hours: <strong>24/7</strong></li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Horizon Center of Foreign Languages and Computer Training. All rights reserved.</p>
      </div>
    </footer>
  );
}


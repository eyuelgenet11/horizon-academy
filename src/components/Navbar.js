'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useTranslation } from '@/components/LanguageContext';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';
  const { locale, changeLanguage, t } = useTranslation();

  const close = () => setIsOpen(false);

  const toggleLanguage = () => {
    changeLanguage(locale === 'en' ? 'am' : 'en');
  };

  return (
    <nav className="navbar glass">
      <div className="container navbar-container">
        <Link href="/" className="navbar-logo">
          <span className="text-gradient">Horizon</span> Academy
        </Link>

        <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
          <Link href="/" onClick={close}>{t('nav.home')}</Link>
          <Link href="/about" onClick={close}>{t('nav.about')}</Link>
          <Link href="/courses" onClick={close}>{t('nav.courses')}</Link>
          <Link href="/learning-portal" onClick={close}>{t('nav.onlineLearning')}</Link>
          <Link href="/blog" onClick={close}>{t('nav.blog')}</Link>
          <Link href="/contact" onClick={close}>{t('nav.contact')}</Link>
          {isAdmin && <Link href="/admin" onClick={close} className="nav-admin-link">Admin</Link>}
        </div>

        <div className="navbar-actions">
          {/* Language Toggle */}
          <button onClick={toggleLanguage} className="btn-lang-toggle" aria-label="Toggle Language">
            🌐 {locale === 'en' ? 'አማርኛ' : 'English'}
          </button>

          {session ? (
            <>
              <Link href="/learning-portal" className="btn btn-outline" onClick={close}>
                {t('nav.myDashboard')}
              </Link>
              <button
                className="btn btn-primary"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline">{t('nav.login')}</Link>
              <Link href="/register" className="btn btn-primary">{t('nav.enrollNow')}</Link>
            </>
          )}
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
}

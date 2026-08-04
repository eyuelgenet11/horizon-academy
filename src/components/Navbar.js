'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useTranslation } from '@/components/LanguageContext';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';
  const { locale, changeLanguage, t } = useTranslation();

  const close = () => setIsOpen(false);

  const toggleLanguage = () => {
    changeLanguage(locale === 'en' ? 'am' : 'en');
  };

  const isActive = (href) => {
    if (!pathname) return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  const navItems = [
    { href: '/', label: t('nav.home') },
    { href: '/about', label: t('nav.about') },
    { href: '/courses', label: t('nav.courses') },
    { href: '/learning-portal', label: t('nav.onlineLearning') },
    { href: '/blog', label: t('nav.blog') },
    { href: '/contact', label: t('nav.contact') },
  ];

  return (
    <nav className="navbar glass">
      <div className="container navbar-container">
        <Link href="/" className="navbar-logo">
          <Image src="/logo.png" alt="Horizon Academy Logo" width={42} height={26} style={{ objectFit: 'contain' }} priority />
          <span className="logo-text"><span className="text-gradient">Horizon</span> Center</span>
        </Link>

        <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className={`nav-link ${isActive(item.href) ? 'nav-link-active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={close}
              className={`nav-link nav-admin-link ${isActive('/admin') ? 'nav-link-active' : ''}`}
            >
              Admin
            </Link>
          )}

          {/* Mobile Actions (Language, Login/Register or Dashboard/Logout) */}
          <div className="mobile-only-actions">
            <button onClick={toggleLanguage} className="btn-lang-toggle w-full" aria-label="Toggle Language">
              🌐 {locale === 'en' ? 'አማርኛ' : 'English'}
            </button>
            {session ? (
              <div className="mobile-action-btns">
                <Link
                  href="/learning-portal"
                  className={`btn ${isActive('/learning-portal') ? 'btn-primary' : 'btn-outline'} w-full`}
                  onClick={close}
                >
                  {t('nav.myDashboard')}
                </Link>
                <button
                  className="btn btn-primary w-full"
                  onClick={() => { close(); signOut({ callbackUrl: '/' }); }}
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="mobile-action-btns">
                <Link href="/login" className="btn btn-outline" onClick={close}>{t('nav.login')}</Link>
                <Link href="/register" className="btn btn-primary" onClick={close}>{t('nav.enrollNow')}</Link>
              </div>
            )}
          </div>
        </div>

        <div className="navbar-actions">
          {/* Language Toggle */}
          <button onClick={toggleLanguage} className="btn-lang-toggle" aria-label="Toggle Language">
            🌐 {locale === 'en' ? 'አማርኛ' : 'English'}
          </button>

          {session ? (
            <>
              <Link
                href="/learning-portal"
                className={`btn ${isActive('/learning-portal') ? 'btn-primary' : 'btn-outline'}`}
                onClick={close}
              >
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

'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useTranslation } from '@/components/LanguageContext';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { locale, changeLanguage, t } = useTranslation();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const close = () => setIsOpen(false);

  const toggleLanguage = () => {
    changeLanguage(locale === 'en' ? 'am' : 'en');
  };

  const isActive = (href) => {
    if (!pathname) return false;
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/courses');
    }
  };

  const navItems = [
    { href: '/', label: t('nav.home') },
    { href: '/courses', label: t('nav.courses') },
    { href: '/learning-portal', label: t('nav.onlineLearning') },
    { href: '/about', label: t('nav.about') },
    { href: '/blog', label: t('nav.blog') },
    { href: '/contact', label: t('nav.contact') },
  ];

  return (
    <nav className="navbar glass">
        <div className="container navbar-container">
          <div className="navbar-left">
            <Link href="/" className="navbar-logo">
              <Image src="/logo.png" alt="Horizon Academy Logo" width={42} height={26} style={{ objectFit: 'contain', width: 'auto', height: 'auto' }} priority />
              <span className="logo-text"><span className="text-gradient">Horizon</span> Center</span>
            </Link>

            {/* Coursera Style Search Bar */}
            <form onSubmit={handleSearch} className="navbar-search-form">
              <input
                type="text"
                placeholder={t('nav.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="navbar-search-input"
              />
              <button type="submit" className="navbar-search-btn" aria-label="Search">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </form>
          </div>

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

            {/* Mobile Actions */}
            <div className="mobile-only-actions">
              <button onClick={toggleLanguage} className="btn-lang-toggle w-full" aria-label="Toggle Language">
                🌐 {locale === 'en' ? 'አማርኛ' : 'English'}
              </button>
              {session ? (
                <div className="mobile-action-btns">
                  {session.user?.role === 'ADMIN' && (
                    <Link href="/admin" className="btn btn-outline w-full text-center" onClick={close}>
                      ⚙️ Admin Panel
                    </Link>
                  )}
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
              <div className="nav-user-group">
                {session.user?.role === 'ADMIN' && (
                  <Link href="/admin" className="btn-nav-action btn-admin-nav" onClick={close}>
                    ⚙️ Admin
                  </Link>
                )}
                <Link
                  href="/learning-portal"
                  className="btn-nav-action btn-dashboard-nav"
                  onClick={close}
                >
                  🎓 {t('nav.myDashboard')}
                </Link>
                <button
                  className="btn-nav-action btn-logout-nav"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  title={t('nav.logout')}
                >
                  🚪 {t('nav.logout')}
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="btn-login-clean">{t('nav.login')}</Link>
                <Link href="/register" className="btn btn-primary btn-join-free">{t('nav.enrollNow')}</Link>
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

import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import Providers from '@/components/Providers';

export const metadata = {
  title: {
    default: 'Horizon Foreign Languages Academy',
    template: '%s | Horizon Academy',
  },
  description:
    'Horizon Foreign Languages Academy — Master practical English, IELTS, Spanish, and more through expert-led, interactive training in Ethiopia.',
  keywords: [
    'English training Ethiopia',
    'IELTS preparation Addis Ababa',
    'language academy Ethiopia',
    'spoken English course',
    'Horizon Academy',
    'ሆራይዘን የቋንቋ ት/ቤት',
  ],
  openGraph: {
    title: 'Horizon Foreign Languages Academy',
    description: 'Let Your Tongue Be Your Weapon — expert language training in Ethiopia.',
    url: 'https://horizonacademy.et',
    siteName: 'Horizon Academy',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Horizon Foreign Languages Academy',
    description: 'Expert language training in Ethiopia. Enroll today.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton phoneNumber="251911000000" />
        </Providers>
      </body>
    </html>
  );
}

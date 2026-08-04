import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import Providers from '@/components/Providers';

export const metadata = {
  title: {
    default: 'Horizon Center of Foreign Languages and Computer Training',
    template: '%s | Horizon Center',
  },
  description:
    'Horizon Center of Foreign Languages and Computer Training — Leading educational institution in Ethiopia for Spoken English, IELTS, and practical computer skills training. Let Your Tongue Be Your Weapon.',
  keywords: [
    'Horizon Center of Foreign Languages and Computer Training',
    'English training Ethiopia',
    'Computer training Addis Ababa',
    'Computer training Bahir Dar',
    'IELTS preparation Ethiopia',
    'spoken English course',
    'ሆራይዘን የውጭ ቋንቋዎችና ኮምፒውተር ስልጠና ማዕከል',
    'Getachew Marie Bogale',
  ],
  openGraph: {
    title: 'Horizon Center of Foreign Languages and Computer Training',
    description: 'Let Your Tongue Be Your Weapon — Quality foreign language and computer skills training in Ethiopia (Addis Ababa & Bahir Dar).',
    url: 'https://horizonacademy.et',
    siteName: 'Horizon Center',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Horizon Center of Foreign Languages and Computer Training',
    description: 'Empowering individuals through quality language education and practical computer skills training in Ethiopia. Enroll today.',
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
          <WhatsAppButton phoneNumber="251977787358" />
        </Providers>
      </body>
    </html>
  );
}

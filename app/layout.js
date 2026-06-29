import { Inter, Jost } from 'next/font/google';
import './globals.css';

// Salesforce Sans and Avant Garde for Salesforce are proprietary.
// Inter is the closest open substitute for Salesforce Sans (humanist sans, similar metrics).
// Jost is a geometric sans modelled on Futura — the same family Avant Garde belongs to.
const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});
const display = Jost({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata = {
  title: 'Workshop Cockpit — MuleSoft Hands-on',
  description:
    'Récupérez vos identifiants pour la session pratique MuleSoft.',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${body.variable} ${display.variable}`}>
      <body className="min-h-screen bg-white font-body text-electric-15 antialiased">
        {children}
      </body>
    </html>
  );
}

import './globals.css';

export const metadata = {
  title: 'Workshop Cockpit — MuleSoft Hands-on',
  description:
    'Récupérez vos identifiants pour la session pratique MuleSoft.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="min-h-screen font-body antialiased">{children}</body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BLOCAGE SCAN',
  description: 'Diagnostique rapide de votre blocage principal.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}

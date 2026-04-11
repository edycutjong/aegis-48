import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aegis-48 — Cross-Chain Security Oracle',
  description:
    'AI-powered smart contract security auditor across 48 blockchains. Paste any contract address, get an instant vulnerability report.',
  openGraph: {
    title: 'Aegis-48 — Cross-Chain Security Oracle',
    description:
      'AI-powered smart contract security auditor across 48 blockchains.',
    type: 'website',
  },
};

import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Script 
          src="https://unpkg.com/@lottiefiles/dotlottie-wc@latest/dist/dotlottie-wc.js" 
          strategy="afterInteractive" 
          type="module" 
        />
        <div className="scan-lines" />
        {children}
      </body>
    </html>
  );
}

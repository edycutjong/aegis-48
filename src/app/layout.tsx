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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <script type="module" src="https://unpkg.com/@lottiefiles/dotlottie-wc@latest/dist/dotlottie-wc.js"></script>
        <div className="scan-lines" />
        {children}
      </body>
    </html>
  );
}

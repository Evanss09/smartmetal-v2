import type { Metadata } from 'next';
import { Inter, Inter_Tight } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';
import TopNav from '@/components/nav/top-nav';
import Footer from '@/components/nav/footer';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const interTight = Inter_Tight({
  variable: '--font-inter-tight',
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'SmartMetal — Tools for Sheet Metal Workers',
    template: '%s | SmartMetal',
  },
  description: 'Material calculators, duct sizing tools, and expert trade advice built for sheet metal workers.',
  openGraph: {
    siteName: 'SmartMetal',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-neutral-100 antialiased">
        <AuthProvider>
          <TopNav />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

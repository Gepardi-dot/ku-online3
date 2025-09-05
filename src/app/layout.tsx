import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { AnnouncementBar } from '@/components/layout/announcement-bar';
import AppFooter from '@/components/layout/footer';
import MobileNav from '@/components/layout/mobile-nav';

export const metadata: Metadata = {
  title: 'KU-ONLINE - Your Global Online Shopping Destination',
  description: 'A multi-vendor local marketplace for the Kurdistan region.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased', 'min-h-screen bg-background font-sans')}>
          <AnnouncementBar />
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex-shrink-0">
                  <Link href="/" className="text-xl font-bold text-gray-900">
                    KU-ONLINE
                  </Link>
                </div>
                <nav className="flex space-x-8">
                  <Link href="/" className="text-gray-600 hover:text-gray-900">
                    Home
                  </Link>
                  <Link href="/auth" className="text-gray-600 hover:text-gray-900">
                    Sign In / Sign Up
                  </Link>
                </nav>
              </div>
            </div>
          </header>
          <div className="pb-16 md:pb-0">{children}</div>
          <MobileNav />
          <AppFooter />
          <Toaster />
      </body>
    </html>
  );
}

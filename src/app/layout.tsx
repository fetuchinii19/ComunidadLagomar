import type { Metadata } from 'next';
import { PT_Sans } from 'next/font/google';
import { cn } from '@/app/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { AppSidebar } from '@/components/app-sidebar';
import { AppHeader } from '@/components/app-header';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Lago Mar',
  description: 'Un sistema para recolectar, organizar y visualizar la información de los residentes de la comunidad Lago Mar.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', ptSans.variable)}>
        <FirebaseClientProvider>
          <AuthProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <div className="flex flex-1 flex-col">
                <AppHeader />
                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                  {children}
                </main>
              </div>
            </div>
            <Toaster />
          </AuthProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NavigationBar from '@/my_components/NavigationBar';
import AuthProvider from './authProvider/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/my_components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'Todo App by Onse',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NavigationBar />
            {children}
          </ThemeProvider>
        </AuthProvider>

        <Toaster />
      </body>
    </html>
  );
}

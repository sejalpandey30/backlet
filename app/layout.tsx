import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Backlet — The Developer & Professional Workspace',
  description:
    'Backlet connects your entire cycle: Discuss → Meet → Decide → Document → Assign → Build → Track. The unified workspace for high-velocity teams.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-screen bg-background text-foreground antialiased`}>
        <ThemeProvider defaultTheme="dark" storageKey="backlet-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

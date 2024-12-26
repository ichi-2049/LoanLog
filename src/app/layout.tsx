// app/layout.tsx
import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Providers } from './providers';
import './globals.css';

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="ja">
      <body className="bg-gray-900">
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
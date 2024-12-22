"use client"
import { ReactNode } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import './globals.css'; 

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname(); // 現在のパスを取得
  const isLoginPage = pathname === '/login';

  // パスに基づいてタイトルを決定する関数
  const getTitle = (path: string) => {
    switch (path) {
      case '/':
        return 'ローン一覧';
      case '/friends':
        return '友達';
      case '/settings':
        return '設定';
      default:
        return 'ローン管理';
    }
  };

  return (
    <html lang="ja">
      <body className="bg-gray-900">
        {!isLoginPage && <Header title={getTitle(pathname)} />}
        <main className={`
          ${!isLoginPage ? 'pt-16 pb-24' : ''} 
          min-h-screen
        `}>
          <SessionProvider>{children}</SessionProvider>
        </main>
        {!isLoginPage && <Footer />}
      </body>
    </html>
  );
}

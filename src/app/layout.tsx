import { ReactNode } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { headers } from 'next/headers';
import './globals.css'; 

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const headersList = headers();
  const pathname = (await headersList).get('x-invoke-path') || '';
  const isLoginPage = pathname === '/login';

  // パスに基づいてタイトルを決定する関数
  const getTitle = (path: string) => {
    switch (path) {
      case '/list':
        return 'ローン一覧';
      case '/users':
        return '相手一覧';
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
          {children}
        </main>
        {!isLoginPage && <Footer />}
      </body>
    </html>
  );
}
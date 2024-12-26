'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { LayoutWrapper } from './components/LayoutWrapper';

interface ProvidersProps {
  children: ReactNode;
  session: Session | null;
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <LayoutWrapper>
        {children}
      </LayoutWrapper>
    </SessionProvider>
  );
}
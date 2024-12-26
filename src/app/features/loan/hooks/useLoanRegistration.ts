// app/features/loan/hooks/useLoanRegistration.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoanFormData } from '../types/loan';
import { useSession } from 'next-auth/react';

export const useLoanRegistration = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const registerLoan = async (data: LoanFormData) => {
    try {
      if (!session) {
        router.push('/login');
        return;
      }

      setIsLoading(true);
      const response = await fetch('/api/loan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include', // Important for sending cookies
      });

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('登録に失敗しました');
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return { registerLoan, isLoading };
};
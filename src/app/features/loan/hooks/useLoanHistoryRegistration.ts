import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoanHistoryFormData } from '../types/loanHistory';

export const useLoanHistoryRegistration = (loanId: string) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const registerHistory = async (data: LoanHistoryFormData) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/loan/${loanId}/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('登録に失敗しました');
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert('登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return { registerHistory, isLoading };
};
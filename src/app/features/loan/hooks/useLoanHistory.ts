import { useState, useEffect } from 'react';
import { LoanHistory } from '../types/loanHistory';

export const useLoanHistory = (loanId: string) => {
  const [histories, setHistories] = useState<LoanHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistories = async () => {
      try {
        const response = await fetch(`/api/loan/${loanId}/history`);
        const data = await response.json();
        if (data.success) {
          setHistories(data.histories);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistories();
  }, [loanId]);

  return { histories, isLoading };
};
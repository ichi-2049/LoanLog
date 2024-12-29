import { useState, useEffect, useCallback } from 'react';
import { Loan } from '../types/loan';

export const useLoan = (loanId: string) => {
  const [loan, setLoan] = useState<Loan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLoan = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/loan/${loanId}`);
      const data = await response.json();
      if (data.success) {
        setLoan(data.loan);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [loanId]);

  useEffect(() => {
    fetchLoan();
  }, [fetchLoan]);

  return { loan, isLoading, refetch: fetchLoan };
};
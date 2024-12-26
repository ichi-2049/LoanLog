import { useState, useEffect } from 'react';
import { Loan, LoanViewType } from '../types/loan';

export const useLoans = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [viewType, setViewType] = useState<LoanViewType>('creditor');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/loan?type=${viewType}`);
        if (!response.ok) throw new Error('Failed to fetch loans');
        const data = await response.json();
        setLoans(data);
      } catch (error) {
        console.error('Error fetching loans:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoans();
  }, [viewType]);

  return { loans, viewType, setViewType, isLoading };
};
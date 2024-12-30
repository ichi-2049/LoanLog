import { useState, useEffect, useCallback } from "react";
import { LoanHistory } from "../types/loanHistory";

export const useLoanHistory = (loanId: string) => {
  const [histories, setHistories] = useState<LoanHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistories = useCallback(async () => {
    try {
      setIsLoading(true);
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
  }, [loanId]);

  useEffect(() => {
    fetchHistories();
  }, [fetchHistories]);

  return { histories, isLoading, refetch: fetchHistories };
};

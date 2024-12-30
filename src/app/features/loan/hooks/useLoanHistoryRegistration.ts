import { useState } from "react";
import { LoanHistoryFormData } from "../types/loanHistory";

export const useLoanHistoryRegistration = (loanId: string) => {
  const [isLoading, setIsLoading] = useState(false);

  const registerHistory = async (
    data: LoanHistoryFormData,
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/loan/${loanId}/history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "登録に失敗しました");
      }

      return true;
    } catch (error) {
      console.error(error);
      alert("登録に失敗しました");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { registerHistory, isLoading };
};

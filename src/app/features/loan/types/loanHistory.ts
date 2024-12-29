export type LoanHistory = {
    loan_history_id: string;
    loan_id: string;
    paid_at: Date;
    paid_amount: number;
    memo: string;
    created_at: Date;
    updated_at: Date;
  };
  
  export type LoanHistoryFormData = {
    paid_at: string;
    paid_amount: number;
    memo: string;
  };
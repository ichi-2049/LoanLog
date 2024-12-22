export type Loan = {
    loan_id: string;
    creditor_uid: string;
    debtor_uid: string;
    title: string;
    total_amount: number;
    remaining_amount: number;
    status: 'PAYING' | 'PAID';
    registered_at: Date;
    creditor: {
      name: string;
    };
    debtor: {
      name: string;
    };
  };
  
  export type LoanViewType = 'creditor' | 'debtor';
export type Loan = {
  loan_id: string;
  creditor_uid: string;
  debtor_uid: string;
  title: string;
  total_amount: number;
  remaining_amount: number;
  status: "PAYING" | "PAID";
  registered_at: Date;
  creditor: {
    name: string;
  };
  debtor: {
    name: string;
  };
  isCreditor: boolean;
};

export type Friend = {
  id: string;
  name: string;
  email: string;
  image: string;
};

export type LoanFormData = {
  title: string;
  amount: number;
  friendId: string;
  type: LoanViewType;
};

export type LoanViewType = "creditor" | "debtor";

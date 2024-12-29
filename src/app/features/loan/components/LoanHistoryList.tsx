'use client';

import { useState } from 'react';
import { useLoanHistory } from '../hooks/useLoanHistory';
import { useLoan } from '../hooks/useLoan';
import { LoanHistoryForm } from './LoanHistoryForm';

interface LoanHistoryListProps {
  loanId: string;
  initialTitle: string;
  initialTotalAmount: number;
  initialRemainingAmount: number;
  initialPartnerName: string;
}

export const LoanHistoryList = ({
  loanId,
  initialTitle,
  initialTotalAmount,
  initialRemainingAmount,
  initialPartnerName,
}: LoanHistoryListProps) => {
  const { histories, isLoading: isLoadingHistories, refetch: refetchHistories } = useLoanHistory(loanId);
  const { loan, isLoading: isLoadingLoan, refetch: refetchLoan } = useLoan(loanId);
  const [showForm, setShowForm] = useState(false);

  const handleSuccess = async () => {
    await Promise.all([refetchHistories(), refetchLoan()]);
    setShowForm(false);
  };

  if (isLoadingHistories || isLoadingLoan) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  const currentTitle = loan?.title ?? initialTitle;
  const currentTotalAmount = loan?.total_amount ?? initialTotalAmount;
  const currentRemainingAmount = loan?.remaining_amount ?? initialRemainingAmount;
  const currentPartnerName = loan?.creditor.name ?? initialPartnerName;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="text-white">
          <h2 className="text-xl font-bold mb-2">{currentTitle}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-300">相手</p>
              <p>{currentPartnerName}</p>
            </div>
            <div>
              <p className="text-gray-300">合計金額</p>
              <p>¥{currentTotalAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-300">残額</p>
              <p>¥{currentRemainingAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {histories.map((history) => (
          <div
            key={history.loan_history_id}
            className="bg-gray-700 p-4 rounded-lg text-white"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-sm text-gray-300">
                  {new Date(history.paid_at).toLocaleDateString()}
                </p>
                <p className="font-bold">¥{history.paid_amount.toLocaleString()}</p>
              </div>
              <button
                className="px-3 py-1 text-sm bg-gray-600 rounded-lg hover:bg-gray-500"
              >
                編集
              </button>
            </div>
            {history.memo && <p className="text-sm text-gray-300">{history.memo}</p>}
          </div>
        ))}
      </div>

      {showForm ? (
        <LoanHistoryForm
          loanId={loanId}
          onCancel={() => setShowForm(false)}
          onSuccess={handleSuccess}
        />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-20 right-4 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg"
        >
          <span className="text-2xl">+</span>
        </button>
      )}
    </div>
  );
};
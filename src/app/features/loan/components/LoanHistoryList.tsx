"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoanHistory } from "../hooks/useLoanHistory";
import { useLoan } from "../hooks/useLoan";
import { LoanHistoryForm } from "./LoanHistoryForm";
import { LoanHistoryEditForm } from "./LoanHistoryEditForm";
import { LoanEditForm } from "./LoanEditForm";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { LoanDeleteConfirmationModal } from "./LoanDeleteConfirmationModal";
import { Trash2, PenLine } from "lucide-react";
import { LoanHistory } from "../types/loanHistory";

interface LoanHistoryListProps {
  loanId: string;
  initialTitle: string;
  initialTotalAmount: number;
  initialRemainingAmount: number;
  initialPartnerName: string | null;
  isCreditor: boolean;
}

export const LoanHistoryList = ({
  loanId,
  initialTitle,
  initialTotalAmount,
  initialRemainingAmount,
  initialPartnerName,
  isCreditor,
}: LoanHistoryListProps) => {
  const router = useRouter();
  const {
    histories,
    isLoading: isLoadingHistories,
    refetch: refetchHistories,
  } = useLoanHistory(loanId);
  const {
    loan,
    isLoading: isLoadingLoan,
    refetch: refetchLoan,
  } = useLoan(loanId);
  const [showForm, setShowForm] = useState(false);
  const [editingHistory, setEditingHistory] = useState<LoanHistory | null>(
    null,
  );
  const [deletingHistory, setDeletingHistory] = useState<LoanHistory | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [showLoanDeleteModal, setShowLoanDeleteModal] = useState(false);
  const [showLoanEditModal, setShowLoanEditModal] = useState(false);
  const [isDeletingLoan, setIsDeletingLoan] = useState(false);

  const handleSuccess = async () => {
    await Promise.all([refetchHistories(), refetchLoan()]);
    setShowForm(false);
  };

  const handleEdit = (history: LoanHistory) => {
    setEditingHistory(history);
  };

  const handleDelete = async (history: LoanHistory) => {
    setDeletingHistory(history);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingHistory) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/loan/${loanId}/history/${deletingHistory.loan_history_id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("削除に失敗しました");
      }

      await Promise.all([refetchHistories(), refetchLoan()]);
    } catch (error) {
      console.error(error);
      alert("削除に失敗しました");
    } finally {
      setIsDeleting(false);
      setDeletingHistory(null);
    }
  };

  const handleLoanDelete = async () => {
    setIsDeletingLoan(true);
    try {
      const response = await fetch(`/api/loan/${loanId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("削除に失敗しました");
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("削除に失敗しました");
      setIsDeletingLoan(false);
      setShowLoanDeleteModal(false);
    }
  };

  if (isLoadingHistories || isLoadingLoan) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  const currentTitle = loan?.title ?? initialTitle;
  const currentTotalAmount = loan?.total_amount ?? initialTotalAmount;
  const currentRemainingAmount =
    loan?.remaining_amount ?? initialRemainingAmount;
  const currentPartnerName = loan
    ? ((isCreditor ? loan.debtor.name : loan.creditor.name) ?? "不明")
    : (initialPartnerName ?? "不明");

  const isFullyPaid = currentRemainingAmount <= 0;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="text-white">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">{currentTitle}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLoanEditModal(true)}
                className="px-3 py-1 text-sm bg-gray-600 rounded-lg hover:bg-gray-500"
              >
                <PenLine className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowLoanDeleteModal(true)}
                className="px-3 py-1 text-sm bg-gray-600 rounded-lg hover:bg-gray-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
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
                <p className="font-bold">
                  ¥{history.paid_amount.toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(history)}
                  className="px-3 py-1 text-sm bg-gray-600 rounded-lg hover:bg-gray-500"
                >
                  <PenLine className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(history)}
                  className="px-3 py-1 text-sm bg-gray-600 rounded-lg hover:bg-gray-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {history.memo && (
              <p className="text-sm text-gray-300">{history.memo}</p>
            )}
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
        !isFullyPaid && (
          <button
            onClick={() => setShowForm(true)}
            className="fixed bottom-20 right-4 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg"
          >
            <span className="text-2xl">+</span>
          </button>
        )
      )}

      {editingHistory && (
        <LoanHistoryEditForm
          loanId={loanId}
          history={editingHistory}
          onCancel={() => setEditingHistory(null)}
          onSuccess={async () => {
            await Promise.all([refetchHistories(), refetchLoan()]);
            setEditingHistory(null);
          }}
        />
      )}

      {deletingHistory && (
        <DeleteConfirmationModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingHistory(null)}
          isLoading={isDeleting}
        />
      )}

      {showLoanDeleteModal && (
        <LoanDeleteConfirmationModal
          onConfirm={handleLoanDelete}
          onCancel={() => setShowLoanDeleteModal(false)}
          isLoading={isDeletingLoan}
        />
      )}

      {showLoanEditModal && (
        <LoanEditForm
          loanId={loanId}
          currentTitle={currentTitle}
          currentTotalAmount={currentTotalAmount}
          onCancel={() => setShowLoanEditModal(false)}
          onSuccess={async () => {
            await refetchLoan();
            setShowLoanEditModal(false);
          }}
        />
      )}
    </div>
  );
};

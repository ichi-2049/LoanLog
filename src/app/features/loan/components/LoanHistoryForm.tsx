"use client";

import { useState } from "react";
import { useLoanHistoryRegistration } from "../hooks/useLoanHistoryRegistration";

interface LoanHistoryFormProps {
  loanId: string;
  onCancel: () => void;
  onSuccess: () => Promise<void>;
}

export const LoanHistoryForm = ({
  loanId,
  onCancel,
  onSuccess,
}: LoanHistoryFormProps) => {
  const { registerHistory, isLoading } = useLoanHistoryRegistration(loanId);
  const [formData, setFormData] = useState({
    paid_at: new Date().toISOString().split("T")[0],
    paid_amount: "",
    memo: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isSuccess = await registerHistory({
      ...formData,
      paid_amount: Number(formData.paid_amount),
    });

    if (isSuccess) {
      await onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
      >
        <h3 className="text-xl font-bold text-white mb-4">支払い登録</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              支払日
            </label>
            <input
              type="date"
              required
              className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
              value={formData.paid_at}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, paid_at: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              支払金額
            </label>
            <input
              type="number"
              required
              className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
              value={formData.paid_amount}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  paid_amount: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              メモ
            </label>
            <textarea
              className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white h-24"
              value={formData.memo}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, memo: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            登録
          </button>
        </div>
      </form>
    </div>
  );
};

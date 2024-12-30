"use client";

import { useState } from "react";

interface LoanEditFormProps {
  loanId: string;
  currentTitle: string;
  currentTotalAmount: number;
  onCancel: () => void;
  onSuccess: () => void;
}

export const LoanEditForm = ({
  loanId,
  currentTitle,
  currentTotalAmount,
  onCancel,
  onSuccess,
}: LoanEditFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: currentTitle,
    total_amount: currentTotalAmount.toString(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/loan/${loanId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          total_amount: Number(formData.total_amount),
        }),
      });

      if (!response.ok) {
        throw new Error("更新に失敗しました");
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      alert("更新に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
      >
        <h3 className="text-xl font-bold text-white mb-4">ローン情報編集</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              タイトル
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              合計金額
            </label>
            <input
              type="number"
              required
              className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
              value={formData.total_amount}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  total_amount: e.target.value,
                }))
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
            更新
          </button>
        </div>
      </form>
    </div>
  );
};

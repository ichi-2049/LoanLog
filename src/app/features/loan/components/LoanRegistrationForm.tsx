"use client";

import { useState } from "react";
import { useFriends } from "../hooks/useFriends";
import { useLoanRegistration } from "../hooks/useLoanRegistration";
import { LoanViewType } from "../types/loan";

type FormData = {
  title: string;
  amount: string;
  friendId: string;
  type: LoanViewType;
};

export const LoanRegistrationForm = () => {
  const { friends, isLoading: isFriendsLoading } = useFriends();
  const { registerLoan, isLoading: isRegistering } = useLoanRegistration();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    amount: "",
    friendId: "",
    type: "debtor",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerLoan({
      ...formData,
      amount: Number(formData.amount),
    });
  };

  if (isFriendsLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-200">
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

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-200">金額</label>
        <input
          type="number"
          required
          className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
          value={formData.amount}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, amount: e.target.value }))
          }
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-200">相手</label>
        <select
          required
          className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
          value={formData.friendId}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, friendId: e.target.value }))
          }
        >
          <option value="">選択してください</option>
          {friends.map((friend) => (
            <option key={friend.id} value={friend.id}>
              {friend.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-200">種別</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="debtor"
              checked={formData.type === "debtor"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  type: e.target.value as LoanViewType,
                }))
              }
            />
            <span className="ml-2 text-white">借りる</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="creditor"
              checked={formData.type === "creditor"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  type: e.target.value as LoanViewType,
                }))
              }
            />
            <span className="ml-2 text-white">貸す</span>
          </label>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => history.back()}
          className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={isRegistering}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        >
          登録
        </button>
      </div>
    </form>
  );
};

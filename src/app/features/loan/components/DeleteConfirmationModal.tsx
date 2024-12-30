"use client";

interface DeleteConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const DeleteConfirmationModal = ({
  onConfirm,
  onCancel,
  isLoading,
}: DeleteConfirmationModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold text-white mb-4">削除の確認</h3>
        <p className="text-gray-300 mb-6">
          この支払い履歴を削除してもよろしいですか？
        </p>

        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
};

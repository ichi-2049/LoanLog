"use client";

import AddButton from "./AddButton";

const LoanList = () => {
  const handleAddLoan = () => {
    // TODO: 新規ローン追加処理
    console.log("新規ローン追加");
  };

  return (
    <div className="space-y-4">
      {/* サンプルのローンカード */}
      <div className="bg-gray-800 p-4 rounded-lg text-white">
        <div className="flex justify-between items-center">
          <span className="font-medium">サンプルローン</span>
          <span>¥10,000</span>
        </div>
        <div className="text-sm text-gray-400 mt-2">支払い期限: 2024/12/31</div>
      </div>

      <AddButton onClick={handleAddLoan} />
    </div>
  );
};

export default LoanList;

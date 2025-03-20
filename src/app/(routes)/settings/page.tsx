"use client";

import { signOut } from "next-auth/react";
import { LogOut, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";


export default function SettingPage() {
  const router = useRouter();
  const navigateToPage = (path: string) => {
    router.push(path);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gray-700 rounded-lg p-6">
        <h2 className="text-lg font-medium text-white mb-6">アカウント設定</h2>

        <div className="border-t border-gray-600 pt-6 flex flex-col gap-5">
          <button
            onClick={() => navigateToPage("/settings/profile")}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Pencil className="w-5 h-5" />
            <span className="font-medium">プロフィール変更</span>
          </button>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">サインアウト</span>
          </button>
        </div>
      </div>
    </div>
  );
}

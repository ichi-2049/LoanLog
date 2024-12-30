"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SettingPage() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gray-700 rounded-lg p-6">
        <h2 className="text-lg font-medium text-white mb-6">アカウント設定</h2>

        <div className="border-t border-gray-600 pt-6">
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

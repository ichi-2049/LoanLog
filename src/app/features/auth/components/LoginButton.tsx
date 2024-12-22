"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export const LoginButton = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <p>こんにちは、{session.user?.name}さん</p>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-md"
          onClick={() => signOut()}
        >
          ログアウト
        </button>
      </div>
    );
  }

  return (
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded-md"
      onClick={() => signIn("google")}
    >
      Googleアカウントでログイン
    </button>
  );
};

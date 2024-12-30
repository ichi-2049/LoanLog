"use client";

import { List, Users, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

const Footer = () => {
  const router = useRouter();

  const navigateToPage = (path: string) => {
    router.push(path);
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 z-10">
      <div className="flex justify-around">
        <button
          onClick={() => navigateToPage("/")}
          className="flex flex-col items-center"
        >
          <List size={24} />
          <span className="text-xs mt-1">一覧</span>
        </button>
        <button
          onClick={() => navigateToPage("/friends")}
          className="flex flex-col items-center"
        >
          <Users size={24} />
          <span className="text-xs mt-1">友達</span>
        </button>
        <button
          onClick={() => navigateToPage("/settings")}
          className="flex flex-col items-center"
        >
          <Settings size={24} />
          <span className="text-xs mt-1">設定</span>
        </button>
      </div>
    </footer>
  );
};

export default Footer;

"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutWrapperProps {
  children: ReactNode;
}

export const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  const getTitle = (path: string) => {
    if (path.includes("/friends")) {
      return "友達"
    } else if (path.includes("/settings")) {
      return "設定"
    } else {
      return "ローン管理"
    }
  }

  return (
    <>
      {!isLoginPage && <Header title={getTitle(pathname)} />}
      <main
        className={`
        ${!isLoginPage ? "pt-16 pb-24" : ""} 
        min-h-screen
      `}
      >
        {children}
      </main>
      {!isLoginPage && <Footer />}
    </>
  );
};

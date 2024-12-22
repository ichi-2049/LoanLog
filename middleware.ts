import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login", // 認証されていない場合にリダイレクトするログインページ
  },
});

export const config = {
  matcher: ["/((?!login|api|_next/static|favicon.ico).*)"], // ログイン不要なパスを除外
};

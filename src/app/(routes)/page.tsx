import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoanList from "@/app/components/LoanList";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-4">
      <div className="mb-6 text-white">
        <h2 className="text-xl">ようこそ、{session.user?.name} さん！</h2>
      </div>
      <LoanList />
    </div>
  );
}
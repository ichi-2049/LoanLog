import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as "creditor" | "debtor";

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const loans = await prisma.loan.findMany({
      where: {
        [type === "creditor" ? "creditor_uid" : "debtor_uid"]: user.id,
      },
      include: {
        creditor: {
          select: { name: true },
        },
        debtor: {
          select: { name: true },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(loans);
  } catch (error) {
    console.error("Error fetching loans:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const { title, amount, friendId, type } = await request.json();

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    const loan = await prisma.loan.create({
      data: {
        title,
        total_amount: amount,
        remaining_amount: amount,
        registered_at: new Date(),
        creditor_uid: type === "creditor" ? currentUser.id : friendId,
        debtor_uid: type === "debtor" ? currentUser.id : friendId,
      },
    });

    return NextResponse.json({ success: true, loan });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to create loan" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

type Props = {
  params: Promise<{ id: string; historyId: string }>;
};

// 履歴更新API
export async function PUT(request: Request, { params }: Props) {
  const { id, historyId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const { paid_at, paid_amount, memo } = await request.json();

    // 現在の支払い履歴を取得
    const currentHistory = await prisma.loanHistory.findUnique({
      where: { loan_history_id: historyId },
      include: { loan: true },
    });

    if (!currentHistory) {
      return NextResponse.json(
        { success: false, error: "History not found" },
        { status: 404 },
      );
    }

    // 支払い金額の差分を計算
    const amountDiff = paid_amount - currentHistory.paid_amount;

    // トランザクションで履歴の更新とローンの残額を更新
    const [history] = await prisma.$transaction([
      prisma.loanHistory.update({
        where: { loan_history_id: historyId },
        data: {
          paid_at: new Date(paid_at),
          paid_amount,
          memo,
        },
      }),
      prisma.loan.update({
        where: { loan_id: id },
        data: {
          remaining_amount: currentHistory.loan.remaining_amount - amountDiff,
        },
      }),
    ]);

    return NextResponse.json({ success: true, history });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to update history" },
      { status: 500 },
    );
  }
}

// 履歴削除API
export async function DELETE(request: Request, { params }: Props) {
  const { id, historyId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    // 削除する履歴を取得
    const historyToDelete = await prisma.loanHistory.findUnique({
      where: { loan_history_id: historyId },
      include: { loan: true },
    });

    if (!historyToDelete) {
      return NextResponse.json(
        { success: false, error: "History not found" },
        { status: 404 },
      );
    }

    // トランザクションで履歴の削除とローンの残額を更新
    await prisma.$transaction([
      prisma.loanHistory.delete({
        where: { loan_history_id: historyId },
      }),
      prisma.loan.update({
        where: { loan_id: id },
        data: {
          remaining_amount:
            historyToDelete.loan.remaining_amount + historyToDelete.paid_amount,
          status: "PAYING",
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to delete history" },
      { status: 500 },
    );
  }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: Request,
  { params }: Props
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const loan = await prisma.loan.findUnique({
      where: { loan_id: id },
      include: {
        creditor: {
          select: {
            id: true,
            name: true,
          },
        },
        debtor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!loan) {
      return NextResponse.json(
        { success: false, error: 'Loan not found' },
        { status: 404 }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const isCreditor = loan.creditor.id === currentUser.id;
    const partnerName = isCreditor ? loan.debtor.name : loan.creditor.name;

    return NextResponse.json({
      success: true,
      loan: {
        ...loan,
        isCreditor,
        partnerName,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch loan' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: Props
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { title, total_amount } = await request.json();

    // 支払い履歴の合計を計算
    const histories = await prisma.loanHistory.findMany({
      where: { loan_id: id },
      select: { paid_amount: true },
    });

    const totalPaid = histories.reduce((sum, history) => sum + history.paid_amount, 0);
    // 残額を計算し、0円未満の場合は0円に設定
    const remaining_amount = Math.max(0, total_amount - totalPaid);

    const loan = await prisma.loan.update({
      where: { loan_id: id },
      data: {
        title,
        total_amount,
        remaining_amount,
        // 残額が0円の場合はPAIDに更新
        status: remaining_amount === 0 ? 'PAID' : 'PAYING',
      },
    });

    return NextResponse.json({ success: true, loan });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: 'Failed to update loan' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: Props
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // トランザクションで関連する支払い履歴とローンを削除
    await prisma.$transaction([
      prisma.loanHistory.deleteMany({
        where: { loan_id: id },
      }),
      prisma.loan.delete({
        where: { loan_id: id },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete loan' },
      { status: 500 }
    );
  }
}
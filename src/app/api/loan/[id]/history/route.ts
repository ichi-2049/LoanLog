import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const histories = await prisma.loanHistory.findMany({
      where: { loan_id: params.id },
      orderBy: { paid_at: 'desc' },
    });

    return NextResponse.json({ success: true, histories });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch histories' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { paid_at, paid_amount, memo } = await request.json();

    const loan = await prisma.loan.findUnique({
      where: { loan_id: params.id },
    });

    if (!loan) {
      return NextResponse.json(
        { success: false, error: 'Loan not found' },
        { status: 404 }
      );
    }

    // トランザクションで支払い履歴の追加と残額の更新を行う
    const [history] = await prisma.$transaction([
      prisma.loanHistory.create({
        data: {
          loan_id: params.id,
          paid_at: new Date(paid_at),
          paid_amount,
          memo,
        },
      }),
      prisma.loan.update({
        where: { loan_id: params.id },
        data: {
          remaining_amount: loan.remaining_amount - paid_amount,
          status: loan.remaining_amount - paid_amount <= 0 ? 'PAID' : 'PAYING',
        },
      }),
    ]);

    return NextResponse.json({ success: true, history });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: 'Failed to create history' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// 個別のローン詳細を取得するAPI
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
    const loan = await prisma.loan.findUnique({
      where: { loan_id: params.id },
      include: {
        creditor: {
          select: {
            name: true,
          },
        },
        debtor: {
          select: {
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

    return NextResponse.json({ success: true, loan });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch loan' },
      { status: 500 }
    );
  }
}
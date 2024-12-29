// app/api/loan/[id]/route.ts
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
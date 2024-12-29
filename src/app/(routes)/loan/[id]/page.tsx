// app/(routes)/loan/[id]/page.tsx
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { LoanHistoryList } from '@/app/features/loan/components/LoanHistoryList';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface LoanDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getLoanDetail(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Unauthorized');
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!currentUser) {
    throw new Error('User not found');
  }

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
    notFound();
  }

  const isCreditor = loan.creditor.id === currentUser.id;
  const partnerName = isCreditor ? loan.debtor.name : loan.creditor.name;

  return {
    ...loan,
    isCreditor,
    partnerName,
  };
}

export default async function LoanDetailPage({ params }: LoanDetailPageProps) {
  const { id } = await params;
  const loan = await getLoanDetail(id);

  return (
    <div className="container mx-auto py-8">
      <LoanHistoryList
        loanId={loan.loan_id}
        initialTitle={loan.title}
        initialTotalAmount={loan.total_amount}
        initialRemainingAmount={loan.remaining_amount}
        initialPartnerName={loan.partnerName || '不明'}
        isCreditor={loan.isCreditor}
      />
    </div>
  );
}
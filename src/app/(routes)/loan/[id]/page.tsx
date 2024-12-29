// app/(routes)/loan/[id]/page.tsx
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { LoanHistoryList } from '@/app/features/loan/components/LoanHistoryList';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface LoanDetailPageProps {
  params: {
    id: string;
  };
}

async function getLoanDetail(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('Unauthorized');
  }

  const loan = await prisma.loan.findUnique({
    where: { loan_id: id },
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
    notFound();
  }

  return loan;
}

export default async function LoanDetailPage({ params }: LoanDetailPageProps) {
  const loan = await getLoanDetail(params.id);

  return (
    <div className="container mx-auto py-8">
      <LoanHistoryList
        loanId={loan.loan_id}
        initialTitle={loan.title}
        initialTotalAmount={loan.total_amount}
        initialRemainingAmount={loan.remaining_amount}
        initialPartnerName={loan.creditor.name || '不明'}
      />
    </div>
  );
}
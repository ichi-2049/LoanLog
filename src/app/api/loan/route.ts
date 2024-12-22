import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') as 'creditor' | 'debtor';

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const loans = await prisma.loan.findMany({
      where: {
        [type === 'creditor' ? 'creditor_uid' : 'debtor_uid']: user.id,
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
        created_at: 'desc',
      },
    });

    return NextResponse.json(loans);
  } catch (error) {
    console.error('Error fetching loans:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
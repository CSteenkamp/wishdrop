import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { cashFundId, amount, note } = await request.json();
  if (!cashFundId || !amount || amount <= 0) {
    return NextResponse.json({ error: 'cashFundId and positive amount required' }, { status: 400 });
  }

  const fund = await prisma.cashFund.findUnique({ where: { id: cashFundId } });
  if (!fund) {
    return NextResponse.json({ error: 'Cash fund not found' }, { status: 404 });
  }

  const contribution = await prisma.cashFundContribution.create({
    data: {
      cashFundId,
      participantId: session.personId,
      name: session.personName,
      amount,
      currency: fund.currency,
      note: note?.trim() || null,
    },
  });

  return NextResponse.json({ contribution }, { status: 201 });
}

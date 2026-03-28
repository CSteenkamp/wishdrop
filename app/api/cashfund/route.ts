import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSessionFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const registryId = request.nextUrl.searchParams.get('registryId');
  if (!registryId) {
    return NextResponse.json({ error: 'registryId required' }, { status: 400 });
  }

  const funds = await prisma.cashFund.findMany({
    where: { registryId },
    include: {
      contributions: {
        select: { id: true, name: true, amount: true, currency: true, note: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { order: 'asc' },
  });

  const fundsWithTotals = funds.map((fund) => ({
    ...fund,
    totalRaised: fund.contributions.reduce((sum, c) => sum + c.amount, 0),
    contributorCount: fund.contributions.length,
  }));

  return NextResponse.json({ funds: fundsWithTotals });
}

export async function POST(request: NextRequest) {
  const adminSession = getAdminSessionFromRequest(request);
  if (!adminSession) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 401 });
  }

  const { registryId, title, description, targetAmount, currency, imageUrl, paymentDetails } = await request.json();
  if (!registryId || !title?.trim()) {
    return NextResponse.json({ error: 'registryId and title required' }, { status: 400 });
  }

  const count = await prisma.cashFund.count({ where: { registryId } });

  const fund = await prisma.cashFund.create({
    data: {
      registryId,
      title: title.trim(),
      description: description?.trim() || null,
      targetAmount: targetAmount || null,
      currency: currency || 'USD',
      imageUrl: imageUrl || null,
      paymentDetails: paymentDetails?.trim() || null,
      order: count,
    },
  });

  return NextResponse.json({ fund }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const adminSession = getAdminSessionFromRequest(request);
  if (!adminSession) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 401 });
  }

  const { id, paymentDetails } = await request.json();
  if (!id) return NextResponse.json({ error: 'Fund id required' }, { status: 400 });

  const fund = await prisma.cashFund.update({
    where: { id },
    data: { paymentDetails: paymentDetails?.trim() || null },
  });

  return NextResponse.json({ fund });
}

export async function DELETE(request: NextRequest) {
  const adminSession = getAdminSessionFromRequest(request);
  if (!adminSession) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 401 });
  }

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'Fund id required' }, { status: 400 });

  await prisma.cashFund.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

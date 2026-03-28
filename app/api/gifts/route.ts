import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { isPaidPlan } from '@/lib/plan-gate';

// PATCH mark gift as received / thank-you sent
export async function PATCH(request: NextRequest) {
  const adminSession = getAdminSessionFromRequest(request);
  if (!adminSession) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 401 });
  }

  const registryId = adminSession.groupId;

  if (!(await isPaidPlan(registryId))) {
    return NextResponse.json({ error: 'Gift tracking is available on the Unlimited plan' }, { status: 403 });
  }

  const { itemId, received, thankYouSent } = await request.json();
  if (!itemId) {
    return NextResponse.json({ error: 'itemId required' }, { status: 400 });
  }

  // Verify item belongs to this registry
  const item = await prisma.wishlistItem.findUnique({
    where: { id: itemId },
    include: { participant: { select: { registryId: true } } },
  });

  if (!item || item.participant.registryId !== registryId) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  const updateData: Record<string, any> = {};
  if (received !== undefined) {
    updateData.received = !!received;
    updateData.receivedAt = received ? new Date() : null;
  }
  if (thankYouSent !== undefined) {
    updateData.thankYouSent = !!thankYouSent;
  }

  const updated = await prisma.wishlistItem.update({
    where: { id: itemId },
    data: updateData,
  });

  return NextResponse.json({ item: updated });
}

// GET thank-you list (all claimed items with reveal data)
export async function GET(request: NextRequest) {
  const adminSession = getAdminSessionFromRequest(request);
  if (!adminSession) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 401 });
  }

  const registryId = adminSession.groupId;

  if (!(await isPaidPlan(registryId))) {
    return NextResponse.json({ error: 'Gift tracking is available on the Unlimited plan' }, { status: 403 });
  }

  const participants = await prisma.participant.findMany({
    where: { registryId },
    select: {
      name: true,
      wishlistItems: {
        where: { claimedById: { not: null } },
        select: {
          id: true,
          title: true,
          claimedByName: true,
          claimNote: true,
          claimedAt: true,
          received: true,
          receivedAt: true,
          thankYouSent: true,
          price: true,
          currency: true,
        },
        orderBy: { claimedAt: 'asc' },
      },
    },
  });

  const allGifts = participants.flatMap((p) =>
    p.wishlistItems.map((item) => ({
      ...item,
      recipientName: p.name,
    }))
  );

  const stats = {
    totalClaimed: allGifts.length,
    totalReceived: allGifts.filter((g) => g.received).length,
    thankYouPending: allGifts.filter((g) => g.received && !g.thankYouSent).length,
  };

  return NextResponse.json({ gifts: allGifts, stats });
}

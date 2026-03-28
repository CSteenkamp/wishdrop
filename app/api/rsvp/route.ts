import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionFromRequest, getAdminSessionFromRequest } from '@/lib/auth';
import { isPaidPlan } from '@/lib/plan-gate';
import { trackEvent } from '@/lib/analytics';

// GET RSVPs for a registry (admin only)
export async function GET(request: NextRequest) {
  const adminSession = getAdminSessionFromRequest(request);
  if (!adminSession) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 401 });
  }

  const registryId = adminSession.groupId;

  if (!(await isPaidPlan(registryId))) {
    return NextResponse.json({ error: 'RSVP tracking is available on the Unlimited plan' }, { status: 403 });
  }

  const rsvps = await prisma.rsvp.findMany({
    where: { registryId },
    orderBy: { createdAt: 'desc' },
  });

  const totalYes = rsvps.filter((r) => r.status === 'yes').reduce((sum, r) => sum + r.headcount, 0);
  const totalMaybe = rsvps.filter((r) => r.status === 'maybe').reduce((sum, r) => sum + r.headcount, 0);
  const totalNo = rsvps.filter((r) => r.status === 'no').length;

  return NextResponse.json({ rsvps, summary: { totalYes, totalMaybe, totalNo, total: rsvps.length } });
}

// POST submit or update RSVP (participant)
export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const registryId = session.groupId;

  if (!(await isPaidPlan(registryId))) {
    return NextResponse.json({ error: 'RSVP is available on the Unlimited plan' }, { status: 403 });
  }

  const { status, headcount, note } = await request.json();

  if (!status || !['yes', 'no', 'maybe'].includes(status)) {
    return NextResponse.json({ error: 'Status must be yes, no, or maybe' }, { status: 400 });
  }

  const count = Math.max(1, Math.min(headcount || 1, 20));

  const rsvp = await prisma.rsvp.upsert({
    where: { participantId: session.personId },
    update: { status, headcount: count, note: note?.trim() || null },
    create: {
      registryId,
      participantId: session.personId,
      name: session.personName,
      status,
      headcount: count,
      note: note?.trim() || null,
    },
  });

  trackEvent(registryId, 'rsvp_submitted', { status, headcount: count }).catch(() => {});

  return NextResponse.json({ rsvp });
}

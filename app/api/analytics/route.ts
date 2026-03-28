import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { isPaidPlan } from '@/lib/plan-gate';
import { getAnalyticsSummary, trackEvent } from '@/lib/analytics';

// GET analytics summary (admin only, paid plan)
export async function GET(request: NextRequest) {
  const adminSession = getAdminSessionFromRequest(request);
  if (!adminSession) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 401 });
  }

  const registryId = adminSession.groupId;

  if (!(await isPaidPlan(registryId))) {
    return NextResponse.json({ error: 'Analytics are available on the Unlimited plan' }, { status: 403 });
  }

  const summary = await getAnalyticsSummary(registryId);
  return NextResponse.json({ analytics: summary });
}

// POST track an event (public — used by the public registry page for page views)
export async function POST(request: NextRequest) {
  const { registryId, event } = await request.json();
  if (!registryId || !event) {
    return NextResponse.json({ error: 'registryId and event required' }, { status: 400 });
  }

  // Only allow page_view from public — other events tracked server-side
  if (event !== 'page_view') {
    return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
  }

  await trackEvent(registryId, event);
  return NextResponse.json({ success: true });
}

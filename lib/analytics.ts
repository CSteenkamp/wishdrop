import { prisma } from '@/lib/db';

export type AnalyticsEventType =
  | 'page_view'
  | 'item_claimed'
  | 'item_unclaimed'
  | 'guest_joined'
  | 'fund_contributed'
  | 'rsvp_submitted';

export async function trackEvent(
  registryId: string,
  event: AnalyticsEventType,
  metadata?: Record<string, any>,
): Promise<void> {
  try {
    await prisma.analyticsEvent.create({
      data: {
        registryId,
        event,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  } catch (error) {
    // Fire-and-forget — don't break the request
    console.error('Analytics tracking error:', error);
  }
}

export interface AnalyticsSummary {
  totalViews: number;
  totalClaims: number;
  totalGuests: number;
  totalContributions: number;
  totalRsvps: number;
  recentActivity: { event: string; createdAt: Date; metadata: string | null }[];
  claimTimeline: { date: string; count: number }[];
  viewTimeline: { date: string; count: number }[];
}

export async function getAnalyticsSummary(registryId: string): Promise<AnalyticsSummary> {
  const [counts, recentActivity, timelineRaw] = await Promise.all([
    // Counts by event type
    prisma.analyticsEvent.groupBy({
      by: ['event'],
      where: { registryId },
      _count: true,
    }),
    // Last 50 events
    prisma.analyticsEvent.findMany({
      where: { registryId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: { event: true, createdAt: true, metadata: true },
    }),
    // Daily timeline for last 30 days
    prisma.$queryRaw<{ date: string; event: string; count: bigint }[]>`
      SELECT DATE(e."createdAt") as date, e.event, COUNT(*)::bigint as count
      FROM "AnalyticsEvent" e
      WHERE e."registryId" = ${registryId}
        AND e."createdAt" > NOW() - INTERVAL '30 days'
      GROUP BY DATE(e."createdAt"), e.event
      ORDER BY date ASC
    `,
  ]);

  const countMap: Record<string, number> = {};
  for (const c of counts) {
    countMap[c.event] = c._count;
  }

  const claimTimeline: { date: string; count: number }[] = [];
  const viewTimeline: { date: string; count: number }[] = [];

  for (const row of timelineRaw) {
    const entry = { date: String(row.date), count: Number(row.count) };
    if (row.event === 'item_claimed') claimTimeline.push(entry);
    if (row.event === 'page_view') viewTimeline.push(entry);
  }

  return {
    totalViews: countMap['page_view'] || 0,
    totalClaims: countMap['item_claimed'] || 0,
    totalGuests: countMap['guest_joined'] || 0,
    totalContributions: countMap['fund_contributed'] || 0,
    totalRsvps: countMap['rsvp_submitted'] || 0,
    recentActivity,
    claimTimeline,
    viewTimeline,
  };
}

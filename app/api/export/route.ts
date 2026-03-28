import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { isPaidPlan } from '@/lib/plan-gate';

export async function GET(request: NextRequest) {
  const adminSession = getAdminSessionFromRequest(request);
  if (!adminSession) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 401 });
  }

  const registryId = adminSession.groupId;

  if (!(await isPaidPlan(registryId))) {
    return NextResponse.json({ error: 'Export is available on the Unlimited plan' }, { status: 403 });
  }

  const registry = await prisma.registry.findUnique({
    where: { id: registryId },
    select: {
      name: true,
      revealEnabled: true,
      participants: {
        select: {
          name: true,
          email: true,
          wishlistItems: {
            orderBy: { order: 'asc' },
            select: {
              title: true,
              link: true,
              price: true,
              currency: true,
              priority: true,
              claimedById: true,
              claimedByName: true,
              claimedAt: true,
              claimNote: true,
              received: true,
              receivedAt: true,
              thankYouSent: true,
              category: { select: { name: true } },
            },
          },
        },
      },
      cashFunds: {
        select: {
          title: true,
          targetAmount: true,
          currency: true,
          contributions: {
            select: { name: true, amount: true, note: true, createdAt: true },
          },
        },
      },
      rsvps: {
        select: { name: true, email: true, status: true, headcount: true, note: true },
      },
    },
  });

  if (!registry) {
    return NextResponse.json({ error: 'Registry not found' }, { status: 404 });
  }

  const format = request.nextUrl.searchParams.get('format') || 'csv';

  // Build CSV
  const lines: string[] = [];

  // Gift items section
  lines.push('--- GIFT LIST ---');
  const headers = ['Participant', 'Email', 'Item', 'Category', 'Price', 'Currency', 'Priority', 'Link', 'Claimed', 'Claimed By', 'Claimed At', 'Note', 'Received', 'Thank You Sent'];
  lines.push(headers.join(','));

  for (const p of registry.participants) {
    for (const item of p.wishlistItems) {
      const row = [
        csvEscape(p.name),
        csvEscape(p.email || ''),
        csvEscape(item.title),
        csvEscape(item.category?.name || ''),
        item.price?.toString() || '',
        item.currency,
        item.priority,
        csvEscape(item.link),
        item.claimedById ? 'Yes' : 'No',
        registry.revealEnabled ? csvEscape(item.claimedByName || '') : '',
        item.claimedAt ? item.claimedAt.toISOString().split('T')[0] : '',
        registry.revealEnabled ? csvEscape(item.claimNote || '') : '',
        item.received ? 'Yes' : 'No',
        item.thankYouSent ? 'Yes' : 'No',
      ];
      lines.push(row.join(','));
    }
  }

  // Cash fund section
  if (registry.cashFunds.length > 0) {
    lines.push('');
    lines.push('--- CASH FUND CONTRIBUTIONS ---');
    lines.push('Fund,Contributor,Amount,Currency,Note,Date');
    for (const fund of registry.cashFunds) {
      for (const c of fund.contributions) {
        lines.push([
          csvEscape(fund.title),
          csvEscape(c.name),
          c.amount.toString(),
          fund.currency,
          csvEscape(c.note || ''),
          c.createdAt.toISOString().split('T')[0],
        ].join(','));
      }
    }
  }

  // RSVP section
  if (registry.rsvps.length > 0) {
    lines.push('');
    lines.push('--- RSVP LIST ---');
    lines.push('Name,Email,Status,Headcount,Note');
    for (const rsvp of registry.rsvps) {
      lines.push([
        csvEscape(rsvp.name),
        csvEscape(rsvp.email || ''),
        rsvp.status,
        rsvp.headcount.toString(),
        csvEscape(rsvp.note || ''),
      ].join(','));
    }
  }

  const csv = lines.join('\n');
  const filename = `${registry.name.replace(/[^a-zA-Z0-9]/g, '-')}-export.csv`;

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

function csvEscape(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

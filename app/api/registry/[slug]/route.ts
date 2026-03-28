import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const registry = await prisma.registry.findFirst({
    where: {
      OR: [
        { slug },
        { inviteCode: slug.toUpperCase() },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      inviteCode: true,
      occasion: true,
      eventDate: true,
      coverImage: true,
      description: true,
      coupleName1: true,
      coupleName2: true,
      personalMessage: true,
      budgetAmount: true,
      budgetCurrency: true,
      revealEnabled: true,
      categories: { orderBy: { order: 'asc' } },
      participants: {
        select: {
          id: true,
          name: true,
          wishlistItems: {
            select: {
              id: true,
              title: true,
              link: true,
              imageUrl: true,
              price: true,
              currency: true,
              priority: true,
              categoryId: true,
              claimedById: true,
              // Don't expose claimedByName on public page
            },
            orderBy: { order: 'asc' },
          },
        },
      },
      cashFunds: {
        include: {
          contributions: {
            select: { amount: true },
          },
        },
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!registry) {
    return NextResponse.json({ error: 'Registry not found' }, { status: 404 });
  }

  // Compute cash fund totals
  const cashFunds = registry.cashFunds.map((fund) => ({
    id: fund.id,
    title: fund.title,
    description: fund.description,
    targetAmount: fund.targetAmount,
    currency: fund.currency,
    imageUrl: fund.imageUrl,
    paymentDetails: fund.paymentDetails,
    totalRaised: fund.contributions.reduce((sum, c) => sum + c.amount, 0),
    contributorCount: fund.contributions.length,
  }));

  // Count items
  const allItems = registry.participants.flatMap((p) => p.wishlistItems);
  const totalItems = allItems.length;
  const claimedItems = allItems.filter((i) => i.claimedById).length;

  return NextResponse.json({
    registry: {
      ...registry,
      cashFunds,
      stats: { totalItems, claimedItems, participantCount: registry.participants.length },
    },
  });
}

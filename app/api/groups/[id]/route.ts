import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionFromRequest, getAdminSessionFromRequest } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const registryId = params.id;

    // Verify caller has access to this registry
    const session = getSessionFromRequest(request);
    const adminSession = getAdminSessionFromRequest(request);

    const isAuthorized =
      (session && session.groupId === registryId) ||
      (adminSession && adminSession.groupId === registryId);

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const registry = await prisma.registry.findUnique({
      where: { id: registryId },
      include: {
        _count: { select: { participants: true } },
        categories: { orderBy: { order: 'asc' } },
        cashFunds: {
          include: {
            contributions: { select: { amount: true } },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!registry) {
      return NextResponse.json({ error: "Registry not found" }, { status: 404 });
    }

    const cashFunds = registry.cashFunds.map((fund) => ({
      ...fund,
      totalRaised: fund.contributions.reduce((sum, c) => sum + c.amount, 0),
      contributorCount: fund.contributions.length,
    }));

    return NextResponse.json({ group: { ...registry, cashFunds } });
  } catch (error) {
    console.error("Error fetching registry:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const registryId = params.id;

    // Only admin can update registry
    const adminSession = getAdminSessionFromRequest(request);
    if (!adminSession || adminSession.groupId !== registryId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const {
      budgetAmount, budgetCurrency,
      coupleName1, coupleName2, personalMessage,
      description, coverImage, revealEnabled,
    } = body;

    const validCurrencies = [
      'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'ZAR', 'JPY', 'CHF',
      'SEK', 'NOK', 'DKK', 'NZD', 'MXN', 'BRL', 'INR', 'CNY',
      'KRW', 'SGD'
    ];

    if (budgetCurrency && !validCurrencies.includes(budgetCurrency)) {
      return NextResponse.json({ error: "Invalid currency code" }, { status: 400 });
    }

    if (budgetAmount !== undefined && budgetAmount !== null && (isNaN(budgetAmount) || budgetAmount < 0)) {
      return NextResponse.json({ error: "Budget amount must be a positive number" }, { status: 400 });
    }

    const updateData: Record<string, any> = { updatedAt: new Date() };

    if (budgetAmount !== undefined) updateData.budgetAmount = budgetAmount;
    if (budgetCurrency) updateData.budgetCurrency = budgetCurrency;
    if (coupleName1 !== undefined) updateData.coupleName1 = coupleName1?.trim() || null;
    if (coupleName2 !== undefined) updateData.coupleName2 = coupleName2?.trim() || null;
    if (personalMessage !== undefined) updateData.personalMessage = personalMessage?.trim() || null;
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (coverImage !== undefined) updateData.coverImage = coverImage?.trim() || null;
    if (revealEnabled !== undefined) updateData.revealEnabled = !!revealEnabled;

    const registry = await prisma.registry.update({
      where: { id: registryId },
      data: updateData,
    });

    return NextResponse.json({ group: registry });
  } catch (error) {
    console.error("Error updating registry:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

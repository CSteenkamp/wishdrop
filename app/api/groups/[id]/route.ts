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
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

    if (!registry) {
      return NextResponse.json({ error: "Registry not found" }, { status: 404 });
    }

    return NextResponse.json({ group: registry });
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

    const { budgetAmount, budgetCurrency } = await request.json();

    const validCurrencies = [
      'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'ZAR', 'JPY', 'CHF',
      'SEK', 'NOK', 'DKK', 'NZD', 'MXN', 'BRL', 'INR', 'CNY',
      'KRW', 'SGD'
    ];

    if (budgetCurrency && !validCurrencies.includes(budgetCurrency)) {
      return NextResponse.json(
        { error: "Invalid currency code" },
        { status: 400 }
      );
    }

    if (budgetAmount !== undefined && budgetAmount !== null && (isNaN(budgetAmount) || budgetAmount < 0)) {
      return NextResponse.json(
        { error: "Budget amount must be a positive number" },
        { status: 400 }
      );
    }

    const registry = await prisma.registry.update({
      where: { id: registryId },
      data: {
        budgetAmount: budgetAmount,
        budgetCurrency: budgetCurrency || "USD",
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ group: registry });
  } catch (error) {
    console.error("Error updating registry:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionFromRequest, getAdminSessionFromRequest } from "@/lib/auth";

export const dynamic = 'force-dynamic';

// GET all wishlist items for a registry
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const registryId = searchParams.get("registryId");

    if (!registryId) {
      return NextResponse.json({ error: "Registry ID is required" }, { status: 400 });
    }

    // Verify caller belongs to this registry
    const session = getSessionFromRequest(request);
    const adminSession = getAdminSessionFromRequest(request);

    const isAuthorized =
      (session && session.groupId === registryId) ||
      (adminSession && adminSession.groupId === registryId);

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get all participants with their wishlist items
    const participants = await prisma.participant.findMany({
      where: { registryId },
      include: {
        wishlistItems: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ participants });
  } catch (error) {
    console.error("Error fetching wishlist items:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

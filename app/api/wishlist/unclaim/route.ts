import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

// POST unclaim a wishlist item
export async function POST(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId } = await request.json();

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    const item = await prisma.wishlistItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Only the person who claimed it can unclaim it (using session, not client data)
    if (item.claimedById !== session.personId) {
      return NextResponse.json({ error: "You can only unclaim items you claimed" }, { status: 403 });
    }

    const updatedItem = await prisma.wishlistItem.update({
      where: { id: itemId },
      data: {
        claimedById: null,
        claimedByName: null,
        claimedAt: null,
      },
    });

    return NextResponse.json({ item: updatedItem });
  } catch (error) {
    console.error("Error unclaiming item:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

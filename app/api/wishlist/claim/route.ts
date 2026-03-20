import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST claim a wishlist item
export async function POST(request: NextRequest) {
  try {
    const { itemId, participantId, participantName } = await request.json();

    if (!itemId || !participantId || !participantName) {
      return NextResponse.json(
        { error: "Item ID, participant ID, and participant name are required" },
        { status: 400 }
      );
    }

    // Find the item
    const item = await prisma.wishlistItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    if (item.claimedById) {
      return NextResponse.json({ error: "This item has already been claimed" }, { status: 409 });
    }

    // Don't allow claiming your own items
    if (item.participantId === participantId) {
      return NextResponse.json({ error: "You cannot claim your own items" }, { status: 400 });
    }

    // Claim the item
    const updatedItem = await prisma.wishlistItem.update({
      where: { id: itemId },
      data: {
        claimedById: participantId,
        claimedByName: participantName,
        claimedAt: new Date(),
      },
    });

    return NextResponse.json({ item: updatedItem });
  } catch (error) {
    console.error("Error claiming item:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

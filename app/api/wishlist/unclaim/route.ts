import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST unclaim a wishlist item
export async function POST(request: NextRequest) {
  try {
    const { itemId, participantId } = await request.json();

    if (!itemId || !participantId) {
      return NextResponse.json(
        { error: "Item ID and participant ID are required" },
        { status: 400 }
      );
    }

    const item = await prisma.wishlistItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Only the person who claimed it can unclaim it
    if (item.claimedById !== participantId) {
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

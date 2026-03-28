import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";
import { sendItemClaimedNotification } from "@/lib/notifications";

// POST claim a wishlist item
export async function POST(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId, note } = await request.json();

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    // Use session data instead of trusting client-provided IDs
    const participantId = session.personId;
    const participantName = session.personName;

    // Find the item
    const item = await prisma.wishlistItem.findUnique({
      where: { id: itemId },
      include: { participant: { select: { registryId: true } } },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Verify same registry
    if (item.participant.registryId !== session.groupId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
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
        claimNote: note?.trim() || null,
      },
    });

    // Send notification to item owner (fire-and-forget)
    const owner = await prisma.participant.findUnique({
      where: { id: item.participantId },
      select: { email: true, name: true, registry: { select: { name: true } } },
    });
    if (owner?.email) {
      sendItemClaimedNotification(owner.email, owner.name, item.title, owner.registry.name).catch(() => {});
    }

    return NextResponse.json({ item: updatedItem });
  } catch (error) {
    console.error("Error claiming item:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

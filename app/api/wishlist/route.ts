import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

// POST/PUT update wishlist items for a participant
export async function POST(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const personId = body.personId;

    // Verify the caller is updating their own wishlist
    if (personId !== session.personId) {
      return NextResponse.json({ error: "You can only update your own wishlist" }, { status: 403 });
    }

    // Accept both single item and array of items
    let items: any[];
    if (Array.isArray(body.items)) {
      items = body.items;
    } else if (body.title) {
      items = [{ title: body.title, link: body.link, imageUrl: body.imageUrl, price: body.price, currency: body.currency, priority: body.priority, order: body.order }];
    } else {
      return NextResponse.json({ error: "Items array or single item fields required" }, { status: 400 });
    }

    if (items.length < 1) {
      return NextResponse.json({ error: "You must have at least 1 wishlist item" }, { status: 400 });
    }

    // Verify participant exists
    const participant = await prisma.participant.findUnique({ where: { id: personId } });
    if (!participant) {
      return NextResponse.json({ error: "Participant not found" }, { status: 404 });
    }

    // Delete existing wishlist items (only unclaimed ones to preserve claims)
    await prisma.wishlistItem.deleteMany({
      where: { participantId: personId, claimedById: null },
    });

    // Create new wishlist items
    const wishlistItems = await Promise.all(
      items
        .filter((item: { title?: string }) => item.title && item.title.trim())
        .map((item: { title: string; link?: string; price?: number; currency?: string; priority?: string; imageUrl?: string }, index: number) =>
          prisma.wishlistItem.create({
            data: {
              participantId: personId,
              title: item.title.trim(),
              link: item.link?.trim() || '',
              price: item.price || null,
              currency: item.currency || 'USD',
              priority: item.priority || 'medium',
              imageUrl: item.imageUrl || null,
              order: index,
            },
          })
        )
    );

    return NextResponse.json({ wishlistItems });
  } catch (error) {
    console.error("Error updating wishlist:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

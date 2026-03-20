import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { loginCode, groupId } = await request.json();

    if (!loginCode) {
      return NextResponse.json({ error: "Login code is required" }, { status: 400 });
    }

    if (!groupId) {
      return NextResponse.json({ error: "Registry ID is required" }, { status: 400 });
    }

    // Find participant by login code in this registry
    const participant = await prisma.participant.findFirst({
      where: {
        loginCode: loginCode.toUpperCase(),
        registryId: groupId,
      },
      include: {
        registry: {
          select: {
            id: true,
            name: true,
            occasion: true,
            eventDate: true,
          },
        },
        wishlistItems: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!participant) {
      return NextResponse.json({ error: "Invalid login code for this registry" }, { status: 401 });
    }

    return NextResponse.json({
      person: {
        id: participant.id,
        name: participant.name,
        loginCode: participant.loginCode,
        group: participant.registry,
        wishlistItems: participant.wishlistItems,
      },
    });
  } catch (error) {
    console.error("User login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

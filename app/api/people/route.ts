import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateLoginCode } from "@/lib/utils";

// GET all participants for a registry
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const registryId = searchParams.get("groupId");

    if (!registryId) {
      return NextResponse.json({ error: "Registry ID is required" }, { status: 400 });
    }

    const participants = await prisma.participant.findMany({
      where: { registryId },
      include: {
        wishlistItems: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: { wishlistItems: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ people: participants });
  } catch (error) {
    console.error("Error fetching participants:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST create a new participant in a registry
export async function POST(request: NextRequest) {
  try {
    const { name, email, groupId } = await request.json();

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!groupId) {
      return NextResponse.json({ error: "Registry ID is required" }, { status: 400 });
    }

    // Validate email if provided
    if (email && email.trim()) {
      const emailTrimmed = email.trim().toLowerCase();

      const existingEmail = await prisma.participant.findFirst({
        where: {
          registryId: groupId,
          email: emailTrimmed
        },
      });

      if (existingEmail) {
        return NextResponse.json({ error: "Email is already used in this registry" }, { status: 400 });
      }
    }

    // Generate unique login code for this registry
    let loginCode = generateLoginCode();
    let exists = await prisma.participant.findFirst({
      where: { registryId: groupId, loginCode },
    });

    while (exists) {
      loginCode = generateLoginCode();
      exists = await prisma.participant.findFirst({
        where: { registryId: groupId, loginCode },
      });
    }

    const participant = await prisma.participant.create({
      data: {
        name: name.trim(),
        email: email && email.trim() ? email.trim().toLowerCase() : null,
        loginCode,
        registryId: groupId,
      },
    });

    return NextResponse.json({ person: participant }, { status: 201 });
  } catch (error) {
    console.error("Error creating participant:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

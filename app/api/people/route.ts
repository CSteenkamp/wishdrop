import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateLoginCode } from "@/lib/utils";
import { hashLoginCode, getAdminSessionFromRequest, getSessionFromRequest } from "@/lib/auth";
import { enforceParticipantLimit } from "@/lib/plan-limits";

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

    // Admin can see login codes; for participants, omit them
    const adminSession = getAdminSessionFromRequest(request);
    const isAdmin = adminSession && adminSession.groupId === registryId;

    const people = participants.map(p => ({
      ...p,
      // Only show login code placeholder for admin (actual plaintext is shown only at creation)
      loginCode: isAdmin ? '(hashed)' : undefined,
    }));

    return NextResponse.json({ people });
  } catch (error) {
    console.error("Error fetching participants:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST create a new participant in a registry
export async function POST(request: NextRequest) {
  try {
    const adminSession = getAdminSessionFromRequest(request);
    const participantSession = getSessionFromRequest(request);

    const body = await request.json();
    const { name, email, groupId, inviteCode } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!groupId) {
      return NextResponse.json({ error: "Registry ID is required" }, { status: 400 });
    }

    // Require either an admin session for this registry, a participant session for
    // this registry, or a valid inviteCode that matches the registry.
    const isAdmin = adminSession && adminSession.groupId === groupId;
    const isParticipant = participantSession && participantSession.groupId === groupId;

    if (!isAdmin && !isParticipant) {
      // Allow self-registration with a valid invite code
      if (!inviteCode) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const registry = await prisma.registry.findUnique({
        where: { id: groupId },
        select: { inviteCode: true },
      });
      if (!registry || registry.inviteCode !== inviteCode.toUpperCase()) {
        return NextResponse.json({ error: "Invalid invite code" }, { status: 401 });
      }
    }

    // Enforce participant plan limits
    const limitCheck = await enforceParticipantLimit(groupId);
    if (!limitCheck.allowed) {
      return NextResponse.json({ error: limitCheck.message }, { status: 403 });
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
    let plaintextCode = generateLoginCode();
    let hashedCode = hashLoginCode(plaintextCode);
    let exists = await prisma.participant.findFirst({
      where: { registryId: groupId, loginCode: hashedCode },
    });

    while (exists) {
      plaintextCode = generateLoginCode();
      hashedCode = hashLoginCode(plaintextCode);
      exists = await prisma.participant.findFirst({
        where: { registryId: groupId, loginCode: hashedCode },
      });
    }

    const participant = await prisma.participant.create({
      data: {
        name: name.trim(),
        email: email && email.trim() ? email.trim().toLowerCase() : null,
        loginCode: hashedCode, // Store hashed
        registryId: groupId,
      },
    });

    // Return the plaintext code only at creation time
    return NextResponse.json({
      person: {
        ...participant,
        loginCode: plaintextCode, // Show plaintext only once
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating participant:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

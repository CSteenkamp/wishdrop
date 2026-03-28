import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSessionFromRequest, hashLoginCode } from "@/lib/auth";
import { generateLoginCode } from "@/lib/utils";

// DELETE a participant (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const participant = await prisma.participant.findUnique({
      where: { id },
      select: { registryId: true },
    });

    if (!participant) {
      return NextResponse.json({ error: "Participant not found" }, { status: 404 });
    }

    const adminSession = getAdminSessionFromRequest(request);
    if (!adminSession || adminSession.groupId !== participant.registryId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.participant.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting participant:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH regenerate login code (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const participant = await prisma.participant.findUnique({
      where: { id },
      select: { registryId: true },
    });

    if (!participant) {
      return NextResponse.json({ error: "Participant not found" }, { status: 404 });
    }

    const adminSession = getAdminSessionFromRequest(request);
    if (!adminSession || adminSession.groupId !== participant.registryId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Generate new unique code
    let plaintextCode = generateLoginCode();
    let hashedCode = hashLoginCode(plaintextCode);
    let exists = await prisma.participant.findFirst({
      where: { registryId: participant.registryId, loginCode: hashedCode },
    });

    while (exists) {
      plaintextCode = generateLoginCode();
      hashedCode = hashLoginCode(plaintextCode);
      exists = await prisma.participant.findFirst({
        where: { registryId: participant.registryId, loginCode: hashedCode },
      });
    }

    await prisma.participant.update({
      where: { id },
      data: { loginCode: hashedCode },
    });

    return NextResponse.json({ loginCode: plaintextCode });
  } catch (error) {
    console.error("Error regenerating code:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

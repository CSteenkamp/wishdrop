import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSessionFromRequest } from "@/lib/auth";

// DELETE a participant (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Verify the participant exists and get their registry
    const participant = await prisma.participant.findUnique({
      where: { id },
      select: { registryId: true },
    });

    if (!participant) {
      return NextResponse.json({ error: "Participant not found" }, { status: 404 });
    }

    // Verify admin session matches the participant's registry
    const adminSession = getAdminSessionFromRequest(request);
    if (!adminSession || adminSession.groupId !== participant.registryId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.participant.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting participant:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

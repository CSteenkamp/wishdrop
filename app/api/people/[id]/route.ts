import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// DELETE a participant
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.participant.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting participant:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

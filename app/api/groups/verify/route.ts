import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { inviteCode } = await request.json();

    if (!inviteCode) {
      return NextResponse.json({ error: "Invite code is required" }, { status: 400 });
    }

    const registry = await prisma.registry.findUnique({
      where: { inviteCode: inviteCode.toUpperCase() },
      select: {
        id: true,
        name: true,
        inviteCode: true,
        occasion: true,
        eventDate: true,
      },
    });

    if (!registry) {
      return NextResponse.json({ error: "Invalid invite code" }, { status: 404 });
    }

    return NextResponse.json({ group: registry });
  } catch (error) {
    console.error("Error verifying registry:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

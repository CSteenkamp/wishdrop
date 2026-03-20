import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateGroupInviteCode } from "@/lib/utils";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { groupName, adminPassword, occasion, eventDate, description } = await request.json();

    if (!groupName || groupName.trim().length === 0) {
      return NextResponse.json({ error: "Registry name is required" }, { status: 400 });
    }

    if (!adminPassword || adminPassword.length < 6) {
      return NextResponse.json(
        { error: "Admin password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const validOccasions = ['birthday', 'wedding', 'baby_shower', 'christmas', 'housewarming', 'graduation', 'other'];
    const selectedOccasion = occasion && validOccasions.includes(occasion) ? occasion : 'other';

    // Generate unique invite code
    let inviteCode = generateGroupInviteCode();
    let exists = await prisma.registry.findUnique({ where: { inviteCode } });

    while (exists) {
      inviteCode = generateGroupInviteCode();
      exists = await prisma.registry.findUnique({ where: { inviteCode } });
    }

    // Hash admin password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create registry with admin config
    const registry = await prisma.registry.create({
      data: {
        name: groupName.trim(),
        inviteCode,
        occasion: selectedOccasion,
        eventDate: eventDate ? new Date(eventDate) : null,
        description: description?.trim() || null,
        adminConfig: {
          create: {
            hashedPassword,
          },
        },
      },
      include: {
        adminConfig: true,
      },
    });

    return NextResponse.json({
      group: {
        id: registry.id,
        name: registry.name,
        inviteCode: registry.inviteCode,
        occasion: registry.occasion,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating registry:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

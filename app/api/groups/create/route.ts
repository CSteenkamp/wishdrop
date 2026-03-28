import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateGroupInviteCode } from "@/lib/utils";
import bcrypt from "bcryptjs";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 60);
}

export async function POST(request: NextRequest) {
  try {
    const {
      groupName,
      adminPassword,
      occasion,
      eventDate,
      description,
      coupleName1,
      coupleName2,
      personalMessage,
      coverImage,
    } = await request.json();

    if (!groupName || groupName.trim().length === 0) {
      return NextResponse.json({ error: "Registry name is required" }, { status: 400 });
    }

    if (!adminPassword || adminPassword.length < 8) {
      return NextResponse.json(
        { error: "Admin password must be at least 8 characters" },
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

    // Generate unique slug
    let baseSlug = generateSlug(groupName.trim());
    let slug = baseSlug;
    let slugExists = await prisma.registry.findUnique({ where: { slug } });
    let suffix = 1;

    while (slugExists) {
      slug = `${baseSlug}-${suffix}`;
      slugExists = await prisma.registry.findUnique({ where: { slug } });
      suffix++;
    }

    // Hash admin password with 12 rounds
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create registry with admin config
    const registry = await prisma.registry.create({
      data: {
        name: groupName.trim(),
        inviteCode,
        slug,
        occasion: selectedOccasion,
        eventDate: eventDate ? new Date(eventDate) : null,
        description: description?.trim() || null,
        coupleName1: coupleName1?.trim() || null,
        coupleName2: coupleName2?.trim() || null,
        personalMessage: personalMessage?.trim() || null,
        coverImage: coverImage?.trim() || null,
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
        slug: registry.slug,
        occasion: registry.occasion,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating registry:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

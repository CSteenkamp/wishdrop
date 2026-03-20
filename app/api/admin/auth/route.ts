import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { password, groupId } = await request.json();

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    if (!groupId) {
      return NextResponse.json({ error: "Registry ID is required" }, { status: 400 });
    }

    const adminConfig = await prisma.adminConfig.findUnique({
      where: { registryId: groupId },
      include: { registry: true },
    });

    if (!adminConfig) {
      return NextResponse.json({ error: "Registry not found" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, adminConfig.hashedPassword);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      group: {
        id: adminConfig.registry.id,
        name: adminConfig.registry.name,
        inviteCode: adminConfig.registry.inviteCode,
        occasion: adminConfig.registry.occasion,
      },
    });
  } catch (error) {
    console.error("Admin auth error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

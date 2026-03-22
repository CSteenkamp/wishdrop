import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { setAdminSessionCookie } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(ip, 'admin');
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rateLimit.retryAfterMs / 1000)) } }
      );
    }

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

    const responseData = {
      success: true,
      group: {
        id: adminConfig.registry.id,
        name: adminConfig.registry.name,
        inviteCode: adminConfig.registry.inviteCode,
        occasion: adminConfig.registry.occasion,
      },
    };

    const response = NextResponse.json(responseData);

    return setAdminSessionCookie(response, {
      groupId: adminConfig.registry.id,
      groupName: adminConfig.registry.name,
      inviteCode: adminConfig.registry.inviteCode,
    });
  } catch (error) {
    console.error("Admin auth error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashLoginCode, setSessionCookie } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(ip, 'auth');
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rateLimit.retryAfterMs / 1000)) } }
      );
    }

    const { loginCode, groupId } = await request.json();

    if (!loginCode) {
      return NextResponse.json({ error: "Login code is required" }, { status: 400 });
    }

    if (!groupId) {
      return NextResponse.json({ error: "Registry ID is required" }, { status: 400 });
    }

    // Hash the login code for lookup
    const hashedCode = hashLoginCode(loginCode);

    // Find participant by hashed login code in this registry
    const participant = await prisma.participant.findFirst({
      where: {
        loginCode: hashedCode,
        registryId: groupId,
      },
      include: {
        registry: {
          select: {
            id: true,
            name: true,
            occasion: true,
            eventDate: true,
          },
        },
        wishlistItems: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!participant) {
      return NextResponse.json({ error: "Invalid login code for this registry" }, { status: 401 });
    }

    const responseData = {
      person: {
        id: participant.id,
        name: participant.name,
        group: participant.registry,
        wishlistItems: participant.wishlistItems,
      },
    };

    const response = NextResponse.json(responseData);

    return setSessionCookie(response, {
      personId: participant.id,
      personName: participant.name,
      groupId: participant.registry.id,
      groupName: participant.registry.name,
      loginMethod: 'code',
    });
  } catch (error) {
    console.error("User login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

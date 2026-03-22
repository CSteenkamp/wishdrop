import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyMagicToken } from '@/lib/email';
import { setSessionCookie } from '@/lib/auth';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Invalid or missing token' },
        { status: 400 }
      );
    }

    // Verify HMAC signature and expiry
    const tokenData = verifyMagicToken(token);
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Check one-time use: look up token hash in DB
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const storedToken = await prisma.magicLinkToken.findUnique({
      where: { token: tokenHash },
    });

    if (!storedToken) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
      );
    }

    if (storedToken.usedAt) {
      return NextResponse.json(
        { error: 'This login link has already been used. Please request a new one.' },
        { status: 400 }
      );
    }

    if (storedToken.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'This login link has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Mark token as used
    await prisma.magicLinkToken.update({
      where: { id: storedToken.id },
      data: { usedAt: new Date() },
    });

    const participant = await prisma.participant.findUnique({
      where: { id: tokenData.personId },
      include: {
        registry: true,
      },
    });

    if (!participant || participant.email !== tokenData.email || participant.registryId !== tokenData.groupId) {
      return NextResponse.json(
        { error: 'Invalid token data' },
        { status: 400 }
      );
    }

    const responseData = {
      success: true,
      person: {
        id: participant.id,
        name: participant.name,
        groupId: participant.registryId,
        groupName: participant.registry.name,
      },
    };

    const response = NextResponse.json(responseData);

    return setSessionCookie(response, {
      personId: participant.id,
      personName: participant.name,
      groupId: participant.registryId,
      groupName: participant.registry.name,
      loginMethod: 'magic-link',
    });
  } catch (error) {
    console.error('Magic link verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

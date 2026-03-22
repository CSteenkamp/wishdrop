import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateMagicToken, sendMagicLinkEmail } from '@/lib/email';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(ip, 'magic-link');
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(rateLimit.retryAfterMs / 1000)) } }
      );
    }

    const { email, groupId } = await request.json();

    if (!email || !groupId) {
      return NextResponse.json(
        { error: 'Email and registry ID are required' },
        { status: 400 }
      );
    }

    // Always return same message to prevent email enumeration
    const safeMessage = 'If this email is registered, a login link has been sent.';

    // Find participant by email and registry
    const participant = await prisma.participant.findUnique({
      where: {
        registryId_email: {
          registryId: groupId,
          email: email.toLowerCase().trim(),
        },
      },
      include: {
        registry: true,
      },
    });

    if (!participant || !participant.email) {
      return NextResponse.json({ message: safeMessage });
    }

    // Generate magic link token
    const token = generateMagicToken({
      personId: participant.id,
      email: participant.email,
      groupId: participant.registryId,
      expires: Date.now() + (15 * 60 * 1000),
    });

    // Store token hash in DB for one-time use
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresMinutes = parseInt(process.env.MAGIC_LINK_EXPIRES_MINUTES || '15');

    await prisma.magicLinkToken.create({
      data: {
        token: tokenHash,
        personId: participant.id,
        email: participant.email,
        groupId: participant.registryId,
        expiresAt: new Date(Date.now() + expiresMinutes * 60 * 1000),
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001';
    const magicLink = `${baseUrl}/auth/verify?token=${token}`;

    const emailSent = await sendMagicLinkEmail(
      participant.email,
      participant.name,
      participant.registry.name,
      magicLink
    );

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: safeMessage });
  } catch (error) {
    console.error('Magic link generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

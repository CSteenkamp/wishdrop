import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateMagicToken, sendMagicLinkEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email, groupId } = await request.json();

    if (!email || !groupId) {
      return NextResponse.json(
        { error: 'Email and registry ID are required' },
        { status: 400 }
      );
    }

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

    if (!participant) {
      return NextResponse.json({
        message: 'If this email is registered, a login link has been sent.',
      });
    }

    if (!participant.email) {
      return NextResponse.json({
        message: 'If this email is registered, a login link has been sent.',
      });
    }

    // Generate magic link token
    const token = generateMagicToken({
      personId: participant.id,
      email: participant.email,
      groupId: participant.registryId,
      expires: Date.now() + (15 * 60 * 1000),
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

    return NextResponse.json({
      message: 'If this email is registered, a login link has been sent.',
    });
  } catch (error) {
    console.error('Magic link generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyMagicToken } from '@/lib/email';

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

    const tokenData = verifyMagicToken(token);

    if (!tokenData) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }

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

    return NextResponse.json({
      success: true,
      person: {
        id: participant.id,
        name: participant.name,
        groupId: participant.registryId,
        groupName: participant.registry.name,
      },
    });
  } catch (error) {
    console.error('Magic link verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

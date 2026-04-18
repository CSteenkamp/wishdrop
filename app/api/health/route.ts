import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    // Clean up expired magic link tokens (older than 1 day)
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      await prisma.magicLinkToken.deleteMany({
        where: {
          OR: [
            { expiresAt: { lt: oneDayAgo } },
            { usedAt: { not: null }, expiresAt: { lt: new Date() } },
          ],
        },
      });
    } catch (cleanupError) {
      // Cleanup is best-effort; do not fail the health check if it errors
      console.warn('[health] Magic link token cleanup failed:', cleanupError);
    }

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    }, { status: 503 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, getAdminSessionFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);
  const adminSession = getAdminSessionFromRequest(request);

  if (session) {
    return NextResponse.json({
      authenticated: true,
      type: 'participant',
      personId: session.personId,
      personName: session.personName,
      groupId: session.groupId,
      groupName: session.groupName,
      loginMethod: session.loginMethod,
    });
  }

  if (adminSession) {
    return NextResponse.json({
      authenticated: true,
      type: 'admin',
      groupId: adminSession.groupId,
      groupName: adminSession.groupName,
      inviteCode: adminSession.inviteCode,
    });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

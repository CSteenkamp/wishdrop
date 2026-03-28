import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { isPaidPlan } from '@/lib/plan-gate';

export async function GET(request: NextRequest) {
  const adminSession = getAdminSessionFromRequest(request);
  if (!adminSession) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 401 });
  }

  const coAdmins = await prisma.coAdmin.findMany({
    where: { registryId: adminSession.groupId },
    orderBy: { addedAt: 'asc' },
  });

  return NextResponse.json({ coAdmins });
}

export async function POST(request: NextRequest) {
  const adminSession = getAdminSessionFromRequest(request);
  if (!adminSession) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 401 });
  }

  const registryId = adminSession.groupId;

  if (!(await isPaidPlan(registryId))) {
    return NextResponse.json({ error: 'Co-admins are available on the Unlimited plan' }, { status: 403 });
  }

  const { email, name } = await request.json();
  if (!email?.trim()) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const coAdmin = await prisma.coAdmin.create({
      data: {
        registryId,
        email: email.trim().toLowerCase(),
        name: name?.trim() || null,
      },
    });
    return NextResponse.json({ coAdmin }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'This email is already a co-admin' }, { status: 409 });
    }
    throw error;
  }
}

export async function DELETE(request: NextRequest) {
  const adminSession = getAdminSessionFromRequest(request);
  if (!adminSession) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 401 });
  }

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: 'Co-admin id required' }, { status: 400 });

  await prisma.coAdmin.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

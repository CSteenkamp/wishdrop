import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionFromRequest, getAdminSessionFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const registryId = request.nextUrl.searchParams.get('registryId');
  if (!registryId) {
    return NextResponse.json({ error: 'registryId required' }, { status: 400 });
  }

  const participantSession = getSessionFromRequest(request);
  const adminSession = getAdminSessionFromRequest(request);

  const authorised =
    (participantSession && participantSession.groupId === registryId) ||
    (adminSession && adminSession.groupId === registryId);

  if (!authorised) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const categories = await prisma.category.findMany({
    where: { registryId },
    orderBy: { order: 'asc' },
  });

  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  const adminSession = getAdminSessionFromRequest(request);
  if (!adminSession) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 401 });
  }

  const { name, registryId } = await request.json();
  if (!name?.trim() || !registryId) {
    return NextResponse.json({ error: 'Name and registryId required' }, { status: 400 });
  }

  if (adminSession.groupId !== registryId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const count = await prisma.category.count({ where: { registryId } });

  try {
    const category = await prisma.category.create({
      data: { registryId, name: name.trim(), order: count },
    });
    return NextResponse.json({ category }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Category already exists' }, { status: 409 });
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
  if (!id) {
    return NextResponse.json({ error: 'Category id required' }, { status: 400 });
  }

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }
  if (existing.registryId !== adminSession.groupId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

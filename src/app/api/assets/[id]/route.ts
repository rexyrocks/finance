import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserId } from '@/lib/fetchers';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getCurrentUserId();
  const body = await req.json();

  const existing = await prisma.asset.findFirst({ where: { id: params.id, userId } });
  if (!existing) return NextResponse.json({ error: 'Asset not found' }, { status: 404 });

  const updated = await prisma.asset.update({ where: { id: params.id }, data: body });

  await prisma.auditLog.create({
    data: {
      action: 'UPDATE',
      entityType: 'Asset',
      entityId: updated.id,
      entityName: updated.name,
      diff: body,
      userId,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getCurrentUserId();
  const existing = await prisma.asset.findFirst({ where: { id: params.id, userId } });
  if (!existing) return NextResponse.json({ error: 'Asset not found' }, { status: 404 });

  await prisma.asset.delete({ where: { id: params.id } });

  await prisma.auditLog.create({
    data: {
      action: 'DELETE',
      entityType: 'Asset',
      entityId: existing.id,
      entityName: existing.name,
      userId,
    },
  });

  return NextResponse.json({ success: true });
}

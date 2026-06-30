import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserId } from '@/lib/fetchers';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getCurrentUserId();
  const existing = await prisma.insurancePolicy.findFirst({ where: { id: params.id, userId } });
  if (!existing) return NextResponse.json({ error: 'Policy not found' }, { status: 404 });

  const body = await req.json();
  if (body.expiryDate) body.expiryDate = new Date(body.expiryDate);
  const updated = await prisma.insurancePolicy.update({ where: { id: params.id }, data: body });

  await prisma.auditLog.create({
    data: { action: 'UPDATE', entityType: 'InsurancePolicy', entityId: updated.id, entityName: updated.provider, diff: body, userId },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getCurrentUserId();
  const existing = await prisma.insurancePolicy.findFirst({ where: { id: params.id, userId } });
  if (!existing) return NextResponse.json({ error: 'Policy not found' }, { status: 404 });

  await prisma.insurancePolicy.delete({ where: { id: params.id } });

  await prisma.auditLog.create({
    data: { action: 'DELETE', entityType: 'InsurancePolicy', entityId: existing.id, entityName: existing.provider, userId },
  });

  return NextResponse.json({ success: true });
}

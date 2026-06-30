import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserId } from '@/lib/fetchers';
import { z } from 'zod';

const assetInput = z.object({
  name: z.string().min(1),
  category: z.enum(['STOCKS', 'MUTUAL_FUNDS', 'GOLD', 'REAL_ESTATE', 'VEHICLES', 'BANK_ACCOUNTS', 'RETIREMENT', 'CASH', 'OTHER']),
  currentValue: z.number().nonnegative(),
  costBasis: z.number().nonnegative().optional(),
  isLiquid: z.boolean().optional(),
});

export async function GET() {
  const userId = await getCurrentUserId();
  const assets = await prisma.asset.findMany({ where: { userId }, orderBy: { currentValue: 'desc' } });
  return NextResponse.json(assets);
}

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  const body = await req.json();
  const parsed = assetInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const asset = await prisma.asset.create({
    data: { ...parsed.data, userId },
  });

  await prisma.auditLog.create({
    data: {
      action: 'CREATE',
      entityType: 'Asset',
      entityId: asset.id,
      entityName: asset.name,
      userId,
    },
  });

  return NextResponse.json(asset, { status: 201 });
}

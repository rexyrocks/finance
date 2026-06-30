import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserId } from '@/lib/fetchers';
import { z } from 'zod';

const liabilityInput = z.object({
  name: z.string().min(1),
  category: z.enum(['HOME_LOAN', 'EDUCATION_LOAN', 'CREDIT_CARD', 'PERSONAL_LOAN', 'VEHICLE_LOAN', 'OTHER_DEBT']),
  outstanding: z.number().nonnegative(),
  originalAmount: z.number().nonnegative().optional(),
  emi: z.number().nonnegative().optional(),
  interestRate: z.number().nonnegative().optional(),
  tenureMonths: z.number().int().nonnegative().optional(),
  remainingMonths: z.number().int().nonnegative().optional(),
});

export async function GET() {
  const userId = await getCurrentUserId();
  const liabilities = await prisma.liability.findMany({ where: { userId }, orderBy: { outstanding: 'desc' } });
  return NextResponse.json(liabilities);
}

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  const parsed = liabilityInput.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const liability = await prisma.liability.create({ data: { ...parsed.data, userId } });

  await prisma.auditLog.create({
    data: { action: 'CREATE', entityType: 'Liability', entityId: liability.id, entityName: liability.name, userId },
  });

  return NextResponse.json(liability, { status: 201 });
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUserId } from '@/lib/fetchers';
import { z } from 'zod';

const policyInput = z.object({
  provider: z.string().min(1),
  policyType: z.enum(['TERM_LIFE', 'ENDOWMENT', 'ACCIDENTAL', 'HEALTH', 'ULIP', 'GROUP']),
  sumAssured: z.number().nonnegative(),
  premium: z.number().nonnegative(),
  premiumCycle: z.string().optional(),
  nominee: z.string().optional(),
  expiryDate: z.string().optional(),
});

export async function GET() {
  const userId = await getCurrentUserId();
  const policies = await prisma.insurancePolicy.findMany({ where: { userId }, orderBy: { sumAssured: 'desc' } });
  return NextResponse.json(policies);
}

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  const parsed = policyInput.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { expiryDate, ...rest } = parsed.data;
  const policy = await prisma.insurancePolicy.create({
    data: { ...rest, expiryDate: expiryDate ? new Date(expiryDate) : undefined, userId },
  });

  await prisma.auditLog.create({
    data: { action: 'CREATE', entityType: 'InsurancePolicy', entityId: policy.id, entityName: policy.provider, userId },
  });

  return NextResponse.json(policy, { status: 201 });
}

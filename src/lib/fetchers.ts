import { prisma } from '@/lib/db';
import type { AssetDTO, LiabilityDTO, InsurancePolicyDTO } from '@/types';

// In a single-tenant deployment this resolves the seeded owner.
// Swap for the authenticated session's user id once NextAuth is wired to real sign-in.
export async function getCurrentUserId(): Promise<string> {
  const user = await prisma.user.findFirst({ where: { email: 'owner@networth.local' } });
  if (!user) throw new Error('No seeded user found — run `npm run db:seed` first.');
  return user.id;
}

export async function getAssets(): Promise<AssetDTO[]> {
  const userId = await getCurrentUserId();
  const rows = await prisma.asset.findMany({ where: { userId }, orderBy: { currentValue: 'desc' } });
  return rows.map((a) => ({
    id: a.id,
    name: a.name,
    category: a.category,
    currentValue: Number(a.currentValue),
    costBasis: a.costBasis ? Number(a.costBasis) : null,
    isLiquid: a.isLiquid,
    quarterTag: a.quarterTag,
    updatedAt: a.updatedAt.toISOString(),
  }));
}

export async function getLiabilities(): Promise<LiabilityDTO[]> {
  const userId = await getCurrentUserId();
  const rows = await prisma.liability.findMany({ where: { userId }, orderBy: { outstanding: 'desc' } });
  return rows.map((l) => ({
    id: l.id,
    name: l.name,
    category: l.category,
    outstanding: Number(l.outstanding),
    originalAmount: l.originalAmount ? Number(l.originalAmount) : null,
    emi: l.emi ? Number(l.emi) : null,
    interestRate: l.interestRate ? Number(l.interestRate) : null,
    tenureMonths: l.tenureMonths,
    remainingMonths: l.remainingMonths,
    quarterTag: l.quarterTag,
  }));
}

export async function getPolicies(): Promise<InsurancePolicyDTO[]> {
  const userId = await getCurrentUserId();
  const rows = await prisma.insurancePolicy.findMany({ where: { userId }, orderBy: { sumAssured: 'desc' } });
  return rows.map((p) => ({
    id: p.id,
    provider: p.provider,
    policyType: p.policyType,
    sumAssured: Number(p.sumAssured),
    premium: Number(p.premium),
    premiumCycle: p.premiumCycle,
    nominee: p.nominee,
    expiryDate: p.expiryDate ? p.expiryDate.toISOString() : null,
    quarterTag: p.quarterTag,
  }));
}

export async function getSnapshots() {
  const userId = await getCurrentUserId();
  return prisma.netWorthSnapshot.findMany({ where: { userId }, orderBy: { asOf: 'asc' } });
}

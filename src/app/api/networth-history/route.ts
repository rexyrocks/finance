import { NextResponse } from 'next/server';
import { getSnapshots } from '@/lib/fetchers';

export async function GET() {
  const snapshots = await getSnapshots();
  return NextResponse.json(
    snapshots.map((s) => ({
      quarter: s.quarterTag,
      asOf: s.asOf,
      totalAssets: Number(s.totalAssets),
      totalLiabilities: Number(s.totalLiab),
      netWorth: Number(s.netWorth),
      totalCover: Number(s.totalCover),
    })),
  );
}

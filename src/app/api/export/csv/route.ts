import { NextRequest, NextResponse } from 'next/server';
import { getAssets, getLiabilities, getPolicies } from '@/lib/fetchers';

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = [headers.join(','), ...rows.map((r) => headers.map((h) => escape(r[h])).join(','))];
  return lines.join('\n');
}

// GET /api/export/csv?type=assets|liabilities|insurance
export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type') ?? 'assets';

  let rows: Record<string, unknown>[] = [];
  if (type === 'assets') {
    rows = (await getAssets()).map((a) => ({
      name: a.name,
      category: a.category,
      currentValue: a.currentValue,
      costBasis: a.costBasis ?? '',
      isLiquid: a.isLiquid,
      quarterTag: a.quarterTag,
    }));
  } else if (type === 'liabilities') {
    rows = (await getLiabilities()).map((l) => ({
      name: l.name,
      category: l.category,
      outstanding: l.outstanding,
      emi: l.emi ?? '',
      interestRate: l.interestRate ?? '',
      quarterTag: l.quarterTag,
    }));
  } else if (type === 'insurance') {
    rows = (await getPolicies()).map((p) => ({
      provider: p.provider,
      policyType: p.policyType,
      sumAssured: p.sumAssured,
      premium: p.premium,
      nominee: p.nominee ?? '',
      quarterTag: p.quarterTag,
    }));
  } else {
    return NextResponse.json({ error: 'type must be one of assets, liabilities, insurance' }, { status: 400 });
  }

  const csv = toCsv(rows);
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${type}.csv"`,
    },
  });
}

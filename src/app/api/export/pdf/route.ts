import { NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { getAssets, getLiabilities, getPolicies } from '@/lib/fetchers';
import { totalAssets, totalLiabilities, totalCover, netWorth, allocationByCategory, financialHealthScore } from '@/lib/calculations';

export async function GET() {
  const [assets, liabilities, policies] = await Promise.all([getAssets(), getLiabilities(), getPolicies()]);
  const ta = totalAssets(assets);
  const tl = totalLiabilities(liabilities);
  const cover = totalCover(policies);
  const nw = netWorth(assets, liabilities);
  const allocation = allocationByCategory(assets);
  const health = financialHealthScore(assets, liabilities, policies);

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]); // A4
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let y = 800;
  const left = 48;

  const drawLine = (text: string, opts: { size?: number; f?: typeof font; color?: [number, number, number]; gap?: number } = {}) => {
    page.drawText(text, {
      x: left,
      y,
      size: opts.size ?? 11,
      font: opts.f ?? font,
      color: rgb(...(opts.color ?? [0.05, 0.05, 0.06])),
    });
    y -= opts.gap ?? (opts.size ?? 11) + 8;
  };

  drawLine('NetWorth OS — financial summary', { size: 20, f: bold, gap: 30 });
  drawLine(`Generated ${new Date().toLocaleDateString('en-IN')} · Quarter ending 30-Jun`, { size: 10, color: [0.4, 0.4, 0.4], gap: 26 });

  drawLine('Net worth', { size: 13, f: bold, gap: 18 });
  drawLine(`Rs ${nw.toFixed(2)} L  (approx Rs ${(nw / 100).toFixed(2)} crore)`, { size: 16, gap: 26 });

  drawLine('Summary', { size: 13, f: bold, gap: 18 });
  drawLine(`Total assets: Rs ${ta.toFixed(2)} L`);
  drawLine(`Total liabilities: Rs ${tl.toFixed(2)} L`);
  drawLine(`Total insurance cover: Rs ${cover.toFixed(2)} L`);
  drawLine(`Financial health score: ${health.score} / 100`, { gap: 24 });

  drawLine('Asset allocation', { size: 13, f: bold, gap: 18 });
  for (const a of allocation.slice(0, 9)) {
    drawLine(`${a.label}: Rs ${a.value.toFixed(2)} L  (${a.pct}%)`, { size: 10, gap: 14 });
  }

  y -= 10;
  drawLine('Recommendations', { size: 13, f: bold, gap: 18 });
  for (const r of health.recommendations) {
    const wrapped = wrap(r, 90);
    for (const line of wrapped) drawLine(line, { size: 10, gap: 13 });
    y -= 4;
  }

  const bytes = await pdf.save();
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="networth-summary.pdf"',
    },
  });
}

function wrap(text: string, width: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const w of words) {
    if ((current + ' ' + w).trim().length > width) {
      lines.push(current.trim());
      current = w;
    } else {
      current += ' ' + w;
    }
  }
  if (current.trim()) lines.push(current.trim());
  return lines;
}

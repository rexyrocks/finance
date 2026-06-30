import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getAssets, getLiabilities, getPolicies } from '@/lib/fetchers';
import { totalAssets, totalLiabilities, totalCover, netWorth, allocationByCategory, financialHealthScore } from '@/lib/calculations';

// POST { question: string } -> { answer: string }
// Requires ANTHROPIC_API_KEY in the environment. Grounds the model in the
// user's real, current portfolio numbers so answers aren't hallucinated.
export async function POST(req: NextRequest) {
  const { question } = (await req.json()) as { question?: string };
  if (!question) {
    return NextResponse.json({ error: 'Missing "question" in request body.' }, { status: 400 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY is not configured on the server.' },
      { status: 500 },
    );
  }

  const [assets, liabilities, policies] = await Promise.all([getAssets(), getLiabilities(), getPolicies()]);
  const ta = totalAssets(assets);
  const tl = totalLiabilities(liabilities);
  const cover = totalCover(policies);
  const nw = netWorth(assets, liabilities);
  const allocation = allocationByCategory(assets);
  const health = financialHealthScore(assets, liabilities, policies);

  const context = `
Portfolio snapshot (INR lakhs, quarter ending 30-Jun):
- Total assets: ${ta.toFixed(2)}
- Total liabilities: ${tl.toFixed(2)}
- Net worth: ${nw.toFixed(2)}
- Total insurance cover: ${cover.toFixed(2)}
- Financial health score: ${health.score}/100
- Asset allocation: ${allocation.map((a) => `${a.label} ${a.pct}%`).join(', ')}
- Assets list: ${assets.map((a) => `${a.name} (${a.category}): ${a.currentValue}`).join('; ')}
- Liabilities list: ${liabilities.map((l) => `${l.name} (${l.category}): ${l.outstanding}`).join('; ')}
- Insurance list: ${policies.map((p) => `${p.provider} (${p.policyType}): ${p.sumAssured}`).join('; ')}
`.trim();

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 600,
    system:
      'You are a precise personal-finance assistant embedded in a net worth dashboard. ' +
      'Answer only from the portfolio data given to you — never invent figures. ' +
      'Keep answers concise, use INR lakhs, and avoid generic disclaimers beyond one short note that this is not professional financial advice when giving a recommendation.',
    messages: [
      {
        role: 'user',
        content: `${context}\n\nQuestion: ${question}`,
      },
    ],
  });

  const answer = message.content
    .map((block) => (block.type === 'text' ? block.text : ''))
    .join('\n')
    .trim();

  return NextResponse.json({ answer });
}

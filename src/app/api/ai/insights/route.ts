import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

import {
  getAssets,
  getLiabilities,
  getPolicies,
} from "@/lib/fetchers";

import {
  totalAssets,
  totalLiabilities,
  totalCover,
  netWorth,
  allocationByCategory,
  financialHealthScore,
} from "@/lib/calculations";

// POST { question: string } -> { answer: string }
// Requires XAI_API_KEY in the environment.
export async function POST(req: NextRequest) {
  try {
    const { question } = (await req.json()) as {
      question?: string;
    };

    if (!question) {
      return NextResponse.json(
        { error: 'Missing "question" in request body.' },
        { status: 400 }
      );
    }

    if (!process.env.XAI_API_KEY) {
      return NextResponse.json(
        {
          error: "XAI_API_KEY is not configured on the server.",
        },
        { status: 500 }
      );
    }

    const [assets, liabilities, policies] = await Promise.all([
      getAssets(),
      getLiabilities(),
      getPolicies(),
    ]);

    const ta = totalAssets(assets);
    const tl = totalLiabilities(liabilities);
    const cover = totalCover(policies);
    const nw = netWorth(assets, liabilities);
    const allocation = allocationByCategory(assets);
    const health = financialHealthScore(
      assets,
      liabilities,
      policies
    );

    const context = `
Portfolio snapshot (INR Lakhs)

Total Assets: ${ta.toFixed(2)}
Total Liabilities: ${tl.toFixed(2)}
Net Worth: ${nw.toFixed(2)}
Insurance Cover: ${cover.toFixed(2)}
Financial Health Score: ${health.score}/100

Asset Allocation:
${allocation
        .map((a) => `- ${a.label}: ${a.pct}%`)
        .join("\n")}

Assets:
${assets
        .map(
          (a) =>
            `- ${a.name} (${a.category}): ₹${a.currentValue}`
        )
        .join("\n")}

Liabilities:
${liabilities
        .map(
          (l) =>
            `- ${l.name} (${l.category}): ₹${l.outstanding}`
        )
        .join("\n")}

Insurance Policies:
${policies
        .map(
          (p) =>
            `- ${p.provider} (${p.policyType}): ₹${p.sumAssured}`
        )
        .join("\n")}
`.trim();

    const client = new OpenAI({
      apiKey: process.env.XAI_API_KEY,
      baseURL: "https://api.x.ai/v1",
    });

    const completion = await client.chat.completions.create({
      model: "grok-4",

      temperature: 0.3,

      messages: [
        {
          role: "system",
          content:
            "You are a professional personal finance assistant embedded inside a Net Worth dashboard. " +
            "Only use the portfolio information supplied to you. " +
            "Never fabricate values or assumptions. " +
            "Keep responses concise, practical, and easy to understand. " +
            "When recommending financial actions, include one brief note that this is not professional financial advice.",
        },
        {
          role: "user",
          content: `${context}\n\nQuestion: ${question}`,
        },
      ],
    });

    const answer =
      completion.choices[0]?.message?.content ??
      "No response generated.";

    return NextResponse.json({
      answer,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to generate AI response.",
      },
      {
        status: 500,
      }
    );
  }
}

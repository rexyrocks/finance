import { PrismaClient, AssetCategory, LiabilityCategory, InsuranceType } from '@prisma/client';

const prisma = new PrismaClient();

// All values in INR lakhs, sourced from the original "Networth statement 2025-26" sheet, 30-Jun quarter.

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'owner@networth.local' },
    update: {},
    create: {
      email: 'owner@networth.local',
      name: 'Account owner',
      role: 'OWNER',
    },
  });

  await prisma.assetHistory.deleteMany({ where: { asset: { userId: user.id } } });
  await prisma.asset.deleteMany({ where: { userId: user.id } });
  await prisma.liability.deleteMany({ where: { userId: user.id } });
  await prisma.insurancePolicy.deleteMany({ where: { userId: user.id } });
  await prisma.netWorthSnapshot.deleteMany({ where: { userId: user.id } });

  // ---------- ASSETS ----------
  const assets: { name: string; category: AssetCategory; value: number; isLiquid?: boolean }[] = [
    { name: 'Bike', category: 'VEHICLES', value: 1.70 },
    { name: 'Mutual fund', category: 'MUTUAL_FUNDS', value: 2.62, isLiquid: true },
    { name: 'NPS', category: 'RETIREMENT', value: 4.15 },
    { name: 'Fixed deposit', category: 'BANK_ACCOUNTS', value: 6.41, isLiquid: true },
    { name: 'Banti Bhaiya, Ratlam (loan given)', category: 'OTHER', value: 0.15 },
    { name: 'Society deposit', category: 'OTHER', value: 0.64 },
    { name: 'Shares — Janu', category: 'STOCKS', value: 0.38, isLiquid: true },
    { name: 'Shares — Kunal', category: 'STOCKS', value: 1.13, isLiquid: true },
    { name: 'Shares — Archana', category: 'STOCKS', value: 7.06, isLiquid: true },
    { name: 'Shares — ISC', category: 'STOCKS', value: 0.42, isLiquid: true },
    { name: 'Plot, Indore', category: 'REAL_ESTATE', value: 95.00 },
    { name: 'Savings — ISC', category: 'BANK_ACCOUNTS', value: 0.02, isLiquid: true },
    { name: 'Savings — Kunal', category: 'BANK_ACCOUNTS', value: 0.00, isLiquid: true },
    { name: 'Savings — Janu', category: 'BANK_ACCOUNTS', value: 0.00, isLiquid: true },
    { name: 'Provident fund', category: 'RETIREMENT', value: 62.52 },
    { name: 'Plot, Orai', category: 'REAL_ESTATE', value: 2.42 },
    { name: 'House, RTM', category: 'REAL_ESTATE', value: 82.00 },
    { name: 'Car', category: 'VEHICLES', value: 0.80 },
    { name: 'Gold', category: 'GOLD', value: 10.00 },
    { name: 'Swarna Ganga scheme', category: 'GOLD', value: 2.01 },
    { name: 'SV LIC', category: 'OTHER', value: 3.50 },
    { name: 'Furniture, new house', category: 'OTHER', value: 4.30 },
    { name: 'Household goods', category: 'OTHER', value: 4.80 },
    { name: 'Leave encashment', category: 'CASH', value: 18.20, isLiquid: true },
    { name: 'Gratuity', category: 'CASH', value: 20.00, isLiquid: true },
    { name: 'Ex-gratia', category: 'CASH', value: 21.00, isLiquid: true },
    { name: '12 months salary (reserve)', category: 'CASH', value: 31.20, isLiquid: true },
  ];

  for (const a of assets) {
    const created = await prisma.asset.create({
      data: {
        name: a.name,
        category: a.category,
        currentValue: a.value,
        isLiquid: a.isLiquid ?? false,
        quarterTag: '30-Jun',
        userId: user.id,
      },
    });
    // seed a light history trail so trend sparklines have data on first load
    await prisma.assetHistory.create({
      data: { assetId: created.id, value: a.value, recordedAt: new Date() },
    });
  }

  // ---------- LIABILITIES ----------
  const liabilities: { name: string; category: LiabilityCategory; outstanding: number; emi?: number; rate?: number }[] = [
    { name: 'MTF borrowing', category: 'OTHER_DEBT', outstanding: 3.99 },
    { name: 'Home loan', category: 'HOME_LOAN', outstanding: 49.28, emi: 0.42, rate: 8.6 },
    { name: 'Top-up loan', category: 'PERSONAL_LOAN', outstanding: 9.94, rate: 9.5 },
    { name: 'Education loan — Janu', category: 'EDUCATION_LOAN', outstanding: 21.62, rate: 9.0 },
    { name: 'Education loan — Kunal', category: 'EDUCATION_LOAN', outstanding: 11.25, rate: 9.0 },
    { name: 'OD against salary', category: 'OTHER_DEBT', outstanding: 14.22 },
    { name: 'OD against FD 1', category: 'OTHER_DEBT', outstanding: 0 },
    { name: 'OD against FD 2', category: 'OTHER_DEBT', outstanding: 0 },
    { name: 'ICICI Bank credit card', category: 'CREDIT_CARD', outstanding: 0.37, rate: 42 },
    { name: 'SBI credit card', category: 'CREDIT_CARD', outstanding: 0.82, rate: 42 },
    { name: 'HDFC credit card', category: 'CREDIT_CARD', outstanding: 0.01, rate: 42 },
    { name: 'Axis credit card', category: 'CREDIT_CARD', outstanding: 0.02, rate: 42 },
    { name: 'Indusind credit card', category: 'CREDIT_CARD', outstanding: 0.15, rate: 42 },
    { name: 'SBI rupay credit card', category: 'CREDIT_CARD', outstanding: 0.00, rate: 42 },
    { name: 'Yes Bank credit card', category: 'CREDIT_CARD', outstanding: 0.00, rate: 42 },
    { name: 'SBI rupay (other)', category: 'CREDIT_CARD', outstanding: 0.00, rate: 42 },
    { name: 'Gold loan', category: 'OTHER_DEBT', outstanding: 4.54, rate: 11 },
    { name: 'Festival loan', category: 'PERSONAL_LOAN', outstanding: 2.76 },
    { name: 'Two wheeler loan', category: 'VEHICLE_LOAN', outstanding: 0.92, rate: 10.5 },
    { name: 'Society dues', category: 'OTHER_DEBT', outstanding: 8.49 },
    { name: 'RBL credit card', category: 'CREDIT_CARD', outstanding: 0.13, rate: 42 },
  ];

  for (const l of liabilities) {
    await prisma.liability.create({
      data: {
        name: l.name,
        category: l.category,
        outstanding: l.outstanding,
        emi: l.emi ?? null,
        interestRate: l.rate ?? null,
        quarterTag: '30-Jun',
        userId: user.id,
      },
    });
  }

  // ---------- INSURANCE ----------
  const policies: { provider: string; type: InsuranceType; sumAssured: number }[] = [
    { provider: 'HDFC Life', type: 'TERM_LIFE', sumAssured: 75.00 },
    { provider: 'Bandhan Life', type: 'TERM_LIFE', sumAssured: 50.00 },
    { provider: 'Swarna Ganga (office)', type: 'GROUP', sumAssured: 3.00 },
    { provider: 'GIC (office)', type: 'GROUP', sumAssured: 3.00 },
    { provider: 'PMSBY', type: 'ACCIDENTAL', sumAssured: 2.00 },
    { provider: 'HDFC accidental', type: 'ACCIDENTAL', sumAssured: 25.00 },
    { provider: 'ATM accidental cover', type: 'ACCIDENTAL', sumAssured: 5.00 },
    { provider: 'Car accidental cover', type: 'ACCIDENTAL', sumAssured: 15.00 },
    { provider: 'LIC Jeevan Jyoti', type: 'TERM_LIFE', sumAssured: 1.00 },
    { provider: 'LIC Jeevan Jyoti (2)', type: 'TERM_LIFE', sumAssured: 1.00 },
    { provider: 'LIC Komal Jeevan', type: 'ENDOWMENT', sumAssured: 1.00 },
    { provider: 'LIC Umang', type: 'ENDOWMENT', sumAssured: 15.00 },
    { provider: 'Society (office)', type: 'GROUP', sumAssured: 5.00 },
    { provider: 'PMJJY accidental (OD account)', type: 'ACCIDENTAL', sumAssured: 2.00 },
    { provider: 'PAI (OD account)', type: 'ACCIDENTAL', sumAssured: 20.00 },
    { provider: 'HL insurance (office)', type: 'GROUP', sumAssured: 49.28 },
    { provider: 'Bike accidental cover', type: 'ACCIDENTAL', sumAssured: 15.00 },
    { provider: 'Bandhan accidental cover', type: 'ACCIDENTAL', sumAssured: 30.00 },
  ];

  for (const p of policies) {
    await prisma.insurancePolicy.create({
      data: {
        provider: p.provider,
        policyType: p.type,
        sumAssured: p.sumAssured,
        premium: Math.round(p.sumAssured * 0.012 * 100) / 100, // placeholder estimate, edit per real premium
        nominee: 'Family',
        quarterTag: '30-Jun',
        userId: user.id,
      },
    });
  }

  // ---------- NET WORTH SNAPSHOT (30-Jun, matches sheet totals) ----------
  await prisma.netWorthSnapshot.create({
    data: {
      totalAssets: 382.43,
      totalLiab: 128.51,
      netWorth: 253.92,
      totalCover: 317.28,
      asOf: new Date('2025-06-30'),
      quarterTag: '30-Jun',
      userId: user.id,
    },
  });

  console.log('Seed complete: 27 assets, 21 liabilities, 18 policies, 1 snapshot.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

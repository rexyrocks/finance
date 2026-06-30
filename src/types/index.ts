export type AssetCategory =
  | 'STOCKS'
  | 'MUTUAL_FUNDS'
  | 'GOLD'
  | 'REAL_ESTATE'
  | 'VEHICLES'
  | 'BANK_ACCOUNTS'
  | 'RETIREMENT'
  | 'CASH'
  | 'OTHER';

export type LiabilityCategory =
  | 'HOME_LOAN'
  | 'EDUCATION_LOAN'
  | 'CREDIT_CARD'
  | 'PERSONAL_LOAN'
  | 'VEHICLE_LOAN'
  | 'OTHER_DEBT';

export type InsuranceType = 'TERM_LIFE' | 'ENDOWMENT' | 'ACCIDENTAL' | 'HEALTH' | 'ULIP' | 'GROUP';

export interface AssetDTO {
  id: string;
  name: string;
  category: AssetCategory;
  currentValue: number;
  costBasis: number | null;
  isLiquid: boolean;
  quarterTag: string;
  updatedAt: string;
}

export interface LiabilityDTO {
  id: string;
  name: string;
  category: LiabilityCategory;
  outstanding: number;
  originalAmount: number | null;
  emi: number | null;
  interestRate: number | null;
  tenureMonths: number | null;
  remainingMonths: number | null;
  quarterTag: string;
}

export interface InsurancePolicyDTO {
  id: string;
  provider: string;
  policyType: InsuranceType;
  sumAssured: number;
  premium: number;
  premiumCycle: string;
  nominee: string | null;
  expiryDate: string | null;
  quarterTag: string;
}

export interface FinancialHealthBreakdown {
  score: number; // 0-100
  components: {
    label: string;
    score: number; // 0-100
    weight: number; // fraction of total
    detail: string;
  }[];
  recommendations: string[];
}

// types/investor.ts
export interface Investor {
  id: string;
  name: string;
  firm: string;
  type: "Angel" | "VC" | "Corporate" | "Accelerator" | "Grant";
  partner_name?: string;
  location: string;
  investment_stage: string[];
  check_size: string;
  industries: string[];
  portfolio: string[];
  bio: string;
  recent_investments: string[];
  website: string;
  intro_required: boolean;
  meeting_available?: boolean;
  last_active?: string;
  match_score?: number;
  email?: string;
  twitter?: string;
  linkedin?: string;
  logo?: string;
}

export interface InvestorRequest {
  industry: string;
  stage: string;
  startupIdea: string;
}
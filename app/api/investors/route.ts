import { NextResponse } from 'next/server';

// Define types locally to avoid import issues
interface Investor {
  id: string;
  name: string;
  firm: string;
  type: string;
  location: string;
  investment_stage: string[];
  check_size: string;
  industries: string[];
  recent_investments: string[];
  meeting_available: boolean;
  last_active?: string;
  match_score?: number;
}

interface RequestBody {
  industry?: string;
  stage?: string;
  startupIdea?: string;
}

export async function POST(
  request: Request
): Promise<NextResponse> {
  try {
    // Parse request body
    const body = await request.json() as RequestBody;
    
    // Extract data with safe defaults
    const industry = body?.industry || '';
    const stage = body?.stage || '';
    const startupIdea = body?.startupIdea || '';
    
    // Validate required fields
    if (!industry || !stage) {
      return NextResponse.json({ 
        error: 'Industry and stage are required',
        investors: []
      }, { status: 400 });
    }
    
    // Get investors
    const investors = getDemoInvestors(industry, stage);
    
    // Calculate scores
    const investorsWithScores = investors.map((investor: Investor) => {
      let score = 50;
      
      if (investor.industries.includes(industry)) score += 20;
      if (investor.investment_stage.includes(stage)) score += 20;
      
      return {
        ...investor,
        match_score: Math.min(score, 99)
      };
    });
    
    // Sort by score
    const sortedInvestors = investorsWithScores.sort((a: Investor, b: Investor) => 
      (b.match_score || 0) - (a.match_score || 0)
    );

    return NextResponse.json({ 
      investors: sortedInvestors,
      timestamp: new Date().toISOString(),
      total_found: sortedInvestors.length,
      source: 'Demo data'
    });

  } catch (error) {
    console.error('Error in investors API:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch investors',
      investors: []
    }, { status: 500 });
  }
}

// Demo investor generator
function getDemoInvestors(industry: string, stage: string): Investor[] {
  return [
    {
      id: '1',
      name: 'Andreessen Horowitz',
      firm: 'Andreessen Horowitz',
      type: 'VC',
      location: 'Menlo Park, CA',
      investment_stage: ['Seed', 'Series A', 'Series B'],
      check_size: '$1M - $50M',
      industries: [industry, 'AI/ML', 'Developer Tools'],
      recent_investments: ['OpenAI', 'Databricks', 'Coinbase'],
      meeting_available: true,
      last_active: 'This week'
    },
    {
      id: '2',
      name: 'Sequoia Capital',
      firm: 'Sequoia Capital',
      type: 'VC',
      location: 'Menlo Park, CA',
      investment_stage: ['Seed', 'Series A', 'Series B', 'Series C'],
      check_size: '$500K - $100M',
      industries: [industry, 'Enterprise', 'Fintech'],
      recent_investments: ['OpenAI', 'Snowflake', 'DoorDash'],
      meeting_available: true,
      last_active: 'This week'
    },
    {
      id: '3',
      name: 'Y Combinator',
      firm: 'Y Combinator',
      type: 'Accelerator',
      location: 'Mountain View, CA',
      investment_stage: ['Pre-seed', 'Seed'],
      check_size: '$125K - $500K',
      industries: ['All', 'Tech'],
      recent_investments: ['Rippling', 'Gusto', 'Brex'],
      meeting_available: true,
      last_active: 'This month'
    },
    {
      id: '4',
      name: 'First Round Capital',
      firm: 'First Round Capital',
      type: 'VC',
      location: 'San Francisco, CA',
      investment_stage: ['Seed', 'Series A'],
      check_size: '$500K - $5M',
      industries: [industry, 'SaaS', 'Consumer'],
      recent_investments: ['Figma', 'Airtable', 'Notion'],
      meeting_available: true,
      last_active: 'This week'
    },
    {
      id: '5',
      name: 'Techstars',
      firm: 'Techstars',
      type: 'Accelerator',
      location: 'Boulder, CO',
      investment_stage: ['Pre-seed', 'Seed'],
      check_size: '$100K - $120K',
      industries: ['All', 'Tech'],
      recent_investments: ['SendGrid', 'Twilio', 'DigitalOcean'],
      meeting_available: true,
      last_active: 'This month'
    }
  ];
}
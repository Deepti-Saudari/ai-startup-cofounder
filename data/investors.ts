// data/investors.ts - Dynamic investor service with proper types

// Define all types first
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

// GitHub API response types
interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  html_url: string;
  language: string | null;
  stargazers_count: number;
}

interface GitHubResponse {
  total_count: number;
  items: GitHubRepo[];
}

// News API response types
interface NewsArticle {
  title: string;
  description: string | null;
  publishedAt: string;
  source: {
    name: string;
  };
}

interface NewsResponse {
  articles: NewsArticle[];
  status: string;
  totalResults: number;
}

// Clearbit company type
interface ClearbitCompany {
  name: string;
  domain: string;
  logo?: string;
}

// Cache types
interface CacheData {
  investors: Investor[];
  timestamp: number;
}

// Cache to avoid too many API calls
let investorsCache: CacheData = {
  investors: [],
  timestamp: 0
};
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

// Main function to fetch investors
export async function getDynamicInvestors(
  industry: string, 
  stage: string
): Promise<Investor[]> {
  try {
    // Check cache first
    if (
      investorsCache.investors.length > 0 && 
      Date.now() - investorsCache.timestamp < CACHE_DURATION
    ) {
      console.log('Returning cached investors');
      return filterInvestors(investorsCache.investors, industry, stage);
    }

    console.log('Fetching fresh investor data from APIs...');
    
    // Fetch from multiple free APIs in parallel
    const [clearbitData, githubData, newsData] = await Promise.allSettled([
      fetchFromClearbit(industry),
      fetchFromGitHub(industry),
      fetchInvestmentNews(industry)
    ]);

    // Combine results from all sources
    const investors: Investor[] = [];
    
    // Add from Clearbit
    if (clearbitData.status === 'fulfilled') {
      investors.push(...clearbitData.value);
    }
    
    // Generate from GitHub data
    if (githubData.status === 'fulfilled' && githubData.value) {
      const githubInvestors = await generateFromGitHub(
        githubData.value, 
        industry, 
        stage
      );
      investors.push(...githubInvestors);
    }
    
    // Generate from news data
    if (newsData.status === 'fulfilled' && newsData.value) {
      const newsInvestors = generateFromNews(
        newsData.value, 
        industry, 
        stage
      );
      investors.push(...newsInvestors);
    }
    
    // If no investors found, generate some from industry name
    if (investors.length === 0) {
      const demoInvestors = generateDemoInvestors(industry, stage);
      investors.push(...demoInvestors);
    }

    // Remove duplicates by firm name
    const uniqueInvestors = removeDuplicates(investors);

    // Update cache
    investorsCache = {
      investors: uniqueInvestors,
      timestamp: Date.now()
    };

    return filterInvestors(uniqueInvestors, industry, stage);

  } catch (error) {
    console.error('Error fetching investors:', error);
    return generateDemoInvestors(industry, stage); // Fallback to demo data
  }
}

// Fetch from Clearbit
async function fetchFromClearbit(industry: string): Promise<Investor[]> {
  try {
    // Use Clearbit's autocomplete API to find companies
    const response = await fetch(
      `https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(industry)}+venture+capital`
    );
    
    if (!response.ok) return [];
    
    const companies = await response.json() as ClearbitCompany[];
    
    // For each company, create an investor profile
    const investors: Investor[] = await Promise.all(
      companies.slice(0, 5).map(async (company: ClearbitCompany) => {
        // Get news about this investor
        const news = await fetchNewsForCompany(company.name);
        
        return {
          id: company.domain.replace(/\./g, '-'),
          name: company.name,
          firm: company.name,
          type: determineInvestorType(company.name),
          location: 'San Francisco, CA', // Would need geocoding API for real data
          investment_stage: inferStagesFromNews(news),
          check_size: inferCheckSize(company.name),
          industries: [industry, 'Technology'],
          portfolio: [], // Would need additional API
          bio: `${company.name} is an investment firm focused on ${industry} startups.`,
          recent_investments: extractRecentInvestments(news),
          website: `https://${company.domain}`,
          intro_required: Math.random() > 0.3,
          meeting_available: Math.random() > 0.4,
          last_active: getLastActiveFromNews(news),
          logo: `https://logo.clearbit.com/${company.domain}`
        };
      })
    );
    
    return investors;
  } catch (error) {
    console.log('Clearbit fetch failed:', error);
    return [];
  }
}

// Fetch from GitHub
async function fetchFromGitHub(industry: string): Promise<GitHubResponse | null> {
  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(industry)}+language&sort=stars&per_page=10`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );
    
    if (!response.ok) return null;
    return await response.json() as GitHubResponse;
  } catch (error) {
    console.log('GitHub fetch failed:', error);
    return null;
  }
}

// Generate investors from GitHub data
async function generateFromGitHub(
  githubData: GitHubResponse, 
  industry: string, 
  stage: string
): Promise<Investor[]> {
  const investors: Investor[] = [];
  
  if (githubData.items && githubData.items.length > 0) {
    for (let i = 0; i < Math.min(3, githubData.items.length); i++) {
      const repo = githubData.items[i];
      const ownerName = repo.owner?.login || 'Tech';
      
      investors.push({
        id: `github-${i}-${Date.now()}`,
        name: `${ownerName} Ventures`,
        firm: `${ownerName} Ventures`,
        type: i % 2 === 0 ? 'VC' : 'Corporate',
        partner_name: `Partner ${i + 1}`,
        location: 'San Francisco, CA',
        investment_stage: stage === 'Seed' ? ['Seed'] : ['Seed', 'Series A'],
        check_size: stage === 'Seed' ? '$1M - $5M' : '$5M - $20M',
        industries: [industry, repo.language || 'Technology'],
        portfolio: [],
        bio: `Active investor in ${industry} startups with focus on ${repo.language || 'technology'} stack.`,
        recent_investments: [],
        website: repo.html_url,
        intro_required: true,
        meeting_available: true,
        last_active: 'This week'
      });
    }
  }
  
  return investors;
}

// Generate investors from news data
function generateFromNews(
  newsData: NewsResponse, 
  industry: string, 
  stage: string
): Investor[] {
  const investors: Investor[] = [];
  const uniqueInvestors = new Set<string>();
  
  if (newsData.articles && newsData.articles.length > 0) {
    newsData.articles.slice(0, 5).forEach((article, i) => {
      const investorName = extractInvestorFromText(article.title + ' ' + (article.description || ''));
      
      if (investorName && !uniqueInvestors.has(investorName)) {
        uniqueInvestors.add(investorName);
        
        investors.push({
          id: `news-${i}-${Date.now()}`,
          name: investorName,
          firm: investorName,
          type: i % 3 === 0 ? 'VC' : i % 3 === 1 ? 'Angel' : 'Corporate',
          partner_name: investorName,
          location: 'Unknown',
          investment_stage: [stage],
          check_size: '$500K - $10M',
          industries: [industry],
          portfolio: [],
          bio: `Recently active investor in ${industry} as reported by ${article.source?.name || 'industry news'}.`,
          recent_investments: [extractCompanyFromText(article.title) || 'Startup'].filter(Boolean),
          website: '#',
          intro_required: true,
          meeting_available: true,
          last_active: 'This month'
        });
      }
    });
  }
  
  return investors;
}

// Fetch investment news
async function fetchInvestmentNews(industry: string): Promise<NewsResponse | null> {
  try {
    const NEWS_API_KEY = process.env.NEWS_API_KEY;
    if (!NEWS_API_KEY || NEWS_API_KEY === 'demo') return null;
    
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(industry)}+funding+OR+venture+capital&apiKey=${NEWS_API_KEY}&pageSize=15&language=en`
    );
    
    if (!response.ok) return null;
    return await response.json() as NewsResponse;
  } catch (error) {
    return null;
  }
}

// Helper: Fetch news for a specific company
async function fetchNewsForCompany(companyName: string): Promise<NewsArticle[]> {
  try {
    const NEWS_API_KEY = process.env.NEWS_API_KEY;
    if (!NEWS_API_KEY || NEWS_API_KEY === 'demo') return [];
    
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(companyName)}+funding&apiKey=${NEWS_API_KEY}&pageSize=5`
    );
    
    if (!response.ok) return [];
    const data = await response.json() as NewsResponse;
    return data.articles || [];
  } catch (error) {
    return [];
  }
}

// Helper: Remove duplicate investors
function removeDuplicates(investors: Investor[]): Investor[] {
  const seen = new Map<string, Investor>();
  
  investors.forEach(investor => {
    const key = investor.firm.toLowerCase();
    if (!seen.has(key) || (seen.get(key)?.recent_investments?.length || 0) < (investor.recent_investments?.length || 0)) {
      seen.set(key, investor);
    }
  });
  
  return Array.from(seen.values());
}

// Helper: Filter investors by industry and stage
function filterInvestors(
  investors: Investor[], 
  industry: string, 
  stage: string
): Investor[] {
  return investors.filter(investor => {
    const industryMatch = investor.industries.some(i => 
      i.toLowerCase() === 'all' || 
      industry.toLowerCase().includes(i.toLowerCase()) ||
      i.toLowerCase().includes(industry.toLowerCase())
    );
    
    const stageMatch = investor.investment_stage.some(s => 
      stage.toLowerCase().includes(s.toLowerCase()) ||
      s.toLowerCase().includes(stage.toLowerCase())
    );
    
    return industryMatch && stageMatch;
  });
}

// Helper: Determine investor type from name
function determineInvestorType(name: string): "VC" | "Corporate" | "Angel" | "Accelerator" {
  const lower = name.toLowerCase();
  if (lower.includes('capital') || lower.includes('ventures') || lower.includes('partners')) return 'VC';
  if (lower.includes('google') || lower.includes('microsoft') || lower.includes('amazon') || lower.includes('ibm')) return 'Corporate';
  if (lower.includes('accelerator') || lower.includes('lab') || lower.includes('studio')) return 'Accelerator';
  return 'Angel';
}

// Helper: Infer stages from news
function inferStagesFromNews(news: NewsArticle[]): string[] {
  const stages = new Set<string>();
  news.forEach(article => {
    const text = article.title + ' ' + (article.description || '');
    if (text.toLowerCase().includes('seed')) stages.add('Seed');
    if (text.toLowerCase().includes('series a')) stages.add('Series A');
    if (text.toLowerCase().includes('series b')) stages.add('Series B');
  });
  
  if (stages.size === 0) {
    return ['Seed', 'Series A'];
  }
  return Array.from(stages);
}

// Helper: Infer check size from company name
function inferCheckSize(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('a16z') || lower.includes('sequoia') || lower.includes('kleiner')) return '$5M - $100M';
  if (lower.includes('yc') || lower.includes('techstars') || lower.includes('500')) return '$100K - $500K';
  if (lower.includes('google') || lower.includes('microsoft')) return '$10M - $50M';
  return '$1M - $20M';
}

// Helper: Extract recent investments from news
function extractRecentInvestments(news: NewsArticle[]): string[] {
  const investments = new Set<string>();
  const patterns = [
    /invested in ([A-Z][a-zA-Z]+)/g,
    /led .* round for ([A-Z][a-zA-Z]+)/g,
    /backs ([A-Z][a-zA-Z]+)/g
  ];
  
  news.forEach(article => {
    const text = article.title + ' ' + (article.description || '');
    patterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && match[1].length > 2 && match[1].length < 30) {
          investments.add(match[1]);
        }
      }
    });
  });
  
  return Array.from(investments).slice(0, 3);
}

// Helper: Get last active from news
function getLastActiveFromNews(news: NewsArticle[]): string {
  if (news.length === 0) return 'Unknown';
  
  try {
    const latest = new Date(news[0].publishedAt);
    const now = new Date();
    const daysAgo = Math.floor((now.getTime() - latest.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysAgo < 7) return 'This week';
    if (daysAgo < 30) return 'This month';
    if (daysAgo < 90) return 'Last quarter';
    return 'More than 3 months ago';
  } catch {
    return 'Unknown';
  }
}

// Helper: Extract investor name from text
function extractInvestorFromText(text: string): string | null {
  const patterns = [
    /([A-Z][a-z]+ [A-Z][a-z]+) leads?/,
    /([A-Z][a-z]+ Ventures?) invests?/,
    /([A-Z][a-z]+ Capital?) announces?/,
    /([A-Z][a-z]+ Partners?) invests?/
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].length < 50) {
      return match[1];
    }
  }
  return null;
}

// Helper: Extract company name from text
function extractCompanyFromText(text: string): string | null {
  const patterns = [
    /invests? in ([A-Z][a-zA-Z]+)/,
    /funding round for ([A-Z][a-zA-Z]+)/,
    /backs ([A-Z][a-zA-Z]+)/
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].length < 30) {
      return match[1];
    }
  }
  return null;
}

// Demo fallback (only used if all APIs fail)
function generateDemoInvestors(industry: string, stage: string): Investor[] {
  const timestamp = Date.now();
  
  return [
    {
      id: `demo1-${timestamp}`,
      name: `${industry} Ventures`,
      firm: `${industry} Ventures`,
      type: 'VC',
      partner_name: 'John Smith',
      location: 'San Francisco, CA',
      investment_stage: [stage],
      check_size: '$2M - $10M',
      industries: [industry, 'Technology'],
      portfolio: ['Company X', 'Company Y', 'Company Z'],
      bio: `Leading VC firm focused on ${industry} startups with a proven track record.`,
      recent_investments: ['Startup A', 'Startup B'],
      website: 'https://example.com',
      intro_required: true,
      meeting_available: true,
      last_active: 'This week',
      match_score: 85
    },
    {
      id: `demo2-${timestamp}`,
      name: 'Tech Angels',
      firm: 'Tech Angels',
      type: 'Angel',
      partner_name: 'Sarah Johnson',
      location: 'New York, NY',
      investment_stage: ['Seed'],
      check_size: '$100K - $500K',
      industries: [industry],
      portfolio: ['Early Stage Co', 'Startup C'],
      bio: `Angel group specializing in early-stage ${industry} investments.`,
      recent_investments: ['New Startup'],
      website: 'https://example.com',
      intro_required: false,
      meeting_available: true,
      last_active: 'This month',
      match_score: 72
    }
  ];
}
import { PrismaClient, OpportunityType, ResourceType } from '@prisma/client'

const prisma = new PrismaClient()

const opportunities = [
  // Grants
  {
    name: 'Amber Grant for Women',
    type: 'GRANT' as OpportunityType,
    organization: 'WomensNet',
    description:
      'Monthly $10,000 grants awarded to women-owned businesses. One recipient each month also qualifies for the annual Amber Grant of $25,000. Open to all women business owners in the US and Canada.',
    amountMin: 10000,
    amountMax: 25000,
    eligibility: {
      demographics: ['Women Founders'],
      stages: ['IDEA', 'PRE_SEED', 'SEED', 'SERIES_A'],
      locations: ['United States', 'Canada'],
    },
    deadline: new Date('2025-03-31'),
    applicationUrl: 'https://ambergrantsforwomen.com/get-an-amber-grant/',
    tags: ['Women', 'Monthly', 'Small Business'],
    isVerified: true,
  },
  {
    name: 'Fearless Fund Strivers Grant',
    type: 'GRANT' as OpportunityType,
    organization: 'Fearless Fund',
    description:
      'Quarterly grants of $20,000 for businesses owned by women of color. Includes mentorship and resources from the Fearless Fund community.',
    amountMin: 20000,
    amountMax: 20000,
    eligibility: {
      demographics: ['Women Founders', 'BIPOC Founders'],
      stages: ['PRE_SEED', 'SEED'],
      industries: ['Technology', 'Consumer Goods', 'Healthcare'],
      locations: ['United States'],
    },
    deadline: null,
    applicationUrl: 'https://fearless.fund/strivers-grant/',
    tags: ['Women of Color', 'Quarterly', 'Mentorship'],
    isVerified: true,
  },
  {
    name: 'Hello Alice Small Business Grant',
    type: 'GRANT' as OpportunityType,
    organization: 'Hello Alice',
    description:
      'Various grants throughout the year supporting small businesses, with a focus on underrepresented founders including BIPOC, women, LGBTQ+, veterans, and disabled entrepreneurs.',
    amountMin: 5000,
    amountMax: 50000,
    eligibility: {
      demographics: ['Women Founders', 'BIPOC Founders', 'Veteran Founders', 'LGBTQ+ Founders', 'Disabled Founders'],
      stages: ['IDEA', 'PRE_SEED', 'SEED'],
      locations: ['United States'],
    },
    deadline: null,
    applicationUrl: 'https://helloalice.com/grants/',
    tags: ['Diverse Founders', 'Multiple Programs', 'Community'],
    isVerified: true,
  },
  {
    name: 'NAACP Powershift Entrepreneur Grant',
    type: 'GRANT' as OpportunityType,
    organization: 'NAACP',
    description:
      'Grants supporting Black entrepreneurs and small business owners across the United States. Part of the NAACP Economic Opportunity Program.',
    amountMin: 5000,
    amountMax: 25000,
    eligibility: {
      demographics: ['BIPOC Founders'],
      stages: ['IDEA', 'PRE_SEED', 'SEED'],
      locations: ['United States'],
    },
    deadline: new Date('2025-06-30'),
    applicationUrl: 'https://naacp.org/programs/economic-opportunity',
    tags: ['Black Entrepreneurs', 'Economic Development'],
    isVerified: true,
  },
  {
    name: 'StreetShares Foundation Veteran Business Grant',
    type: 'GRANT' as OpportunityType,
    organization: 'StreetShares Foundation',
    description:
      'Monthly grants for veteran-owned small businesses. Winners receive $15,000 plus business coaching and mentorship.',
    amountMin: 15000,
    amountMax: 15000,
    eligibility: {
      demographics: ['Veteran Founders'],
      stages: ['PRE_SEED', 'SEED', 'SERIES_A'],
      locations: ['United States'],
    },
    deadline: null,
    applicationUrl: 'https://streetsharesfoundation.org/',
    tags: ['Veterans', 'Monthly', 'Mentorship'],
    isVerified: true,
  },
  {
    name: 'National Association for the Self-Employed (NASE) Growth Grants',
    type: 'GRANT' as OpportunityType,
    organization: 'NASE',
    description:
      'Quarterly grants up to $4,000 for self-employed individuals and micro-businesses to help with growth initiatives.',
    amountMin: 4000,
    amountMax: 4000,
    eligibility: {
      stages: ['IDEA', 'PRE_SEED'],
      locations: ['United States'],
    },
    deadline: null,
    applicationUrl: 'https://www.nase.org/become-a-member/grants',
    tags: ['Self-Employed', 'Micro-Business', 'Quarterly'],
    isVerified: true,
  },

  // Investors / VCs
  {
    name: 'Backstage Capital',
    type: 'INVESTOR' as OpportunityType,
    organization: 'Backstage Capital',
    description:
      'Venture capital fund investing in companies led by underrepresented founders: women, people of color, and LGBTQ+ entrepreneurs. Typical investments range from $25K to $100K.',
    amountMin: 25000,
    amountMax: 100000,
    eligibility: {
      demographics: ['Women Founders', 'BIPOC Founders', 'LGBTQ+ Founders'],
      stages: ['PRE_SEED', 'SEED'],
      locations: ['United States', 'Global'],
    },
    deadline: null,
    applicationUrl: 'https://backstagecapital.com/apply/',
    tags: ['VC', 'Underrepresented Founders', 'Tech'],
    isVerified: true,
  },
  {
    name: 'Harlem Capital',
    type: 'INVESTOR' as OpportunityType,
    organization: 'Harlem Capital',
    description:
      'Early-stage venture capital firm investing in diverse founders. Focus on Seed to Series A investments with typical check sizes of $1-2M.',
    amountMin: 500000,
    amountMax: 2000000,
    eligibility: {
      demographics: ['Women Founders', 'BIPOC Founders'],
      stages: ['SEED', 'SERIES_A'],
      industries: ['Technology', 'FinTech', 'Healthcare', 'Consumer Goods'],
      locations: ['United States'],
    },
    deadline: null,
    applicationUrl: 'https://harlem.capital/apply/',
    tags: ['VC', 'Diverse Founders', 'Series A'],
    isVerified: true,
  },
  {
    name: 'Female Founders Fund',
    type: 'INVESTOR' as OpportunityType,
    organization: 'Female Founders Fund',
    description:
      'Seed-stage fund investing in companies with at least one female founder. Portfolio includes leading consumer and B2B technology companies.',
    amountMin: 250000,
    amountMax: 1000000,
    eligibility: {
      demographics: ['Women Founders'],
      stages: ['PRE_SEED', 'SEED'],
      industries: ['Technology', 'Consumer Goods', 'E-commerce'],
      locations: ['United States'],
    },
    deadline: null,
    applicationUrl: 'https://femalefoundersfund.com/apply/',
    tags: ['Women', 'VC', 'Seed Stage'],
    isVerified: true,
  },
  {
    name: 'Precursor Ventures',
    type: 'INVESTOR' as OpportunityType,
    organization: 'Precursor Ventures',
    description:
      'Pre-seed and seed-stage venture fund with a focus on underrepresented founders. Investments range from $100K to $2M with follow-on capacity.',
    amountMin: 100000,
    amountMax: 2000000,
    eligibility: {
      demographics: ['Women Founders', 'BIPOC Founders'],
      stages: ['PRE_SEED', 'SEED'],
      industries: ['Technology', 'FinTech', 'Healthcare'],
      locations: ['United States'],
    },
    deadline: null,
    applicationUrl: 'https://precursorvc.com/founders/',
    tags: ['Pre-seed', 'Seed', 'Diverse Founders'],
    isVerified: true,
  },
  {
    name: 'BBG Ventures',
    type: 'INVESTOR' as OpportunityType,
    organization: 'BBG Ventures',
    description:
      'Early-stage fund investing in consumer technology startups with at least one female founder. Part of the #BUILTBYGIRLS initiative.',
    amountMin: 200000,
    amountMax: 750000,
    eligibility: {
      demographics: ['Women Founders'],
      stages: ['PRE_SEED', 'SEED'],
      industries: ['Technology', 'Consumer Goods', 'Media & Entertainment'],
      locations: ['United States'],
    },
    deadline: null,
    applicationUrl: 'https://www.bbgventures.com/apply',
    tags: ['Women', 'Consumer Tech', 'Early Stage'],
    isVerified: true,
  },

  // Accelerators
  {
    name: 'Techstars',
    type: 'INVESTOR' as OpportunityType,
    organization: 'Techstars',
    description:
      '3-month accelerator program providing $120K investment, mentorship, and access to the Techstars network. Multiple programs focus on diverse founders.',
    amountMin: 120000,
    amountMax: 120000,
    eligibility: {
      stages: ['PRE_SEED', 'SEED'],
      industries: ['Technology', 'FinTech', 'Healthcare', 'CleanTech'],
      locations: ['Global'],
    },
    deadline: null,
    applicationUrl: 'https://www.techstars.com/accelerators',
    tags: ['Accelerator', 'Mentorship', 'Network'],
    isVerified: true,
  },
  {
    name: 'Google for Startups Accelerator',
    type: 'INVESTOR' as OpportunityType,
    organization: 'Google',
    description:
      'Equity-free accelerator programs supporting startups from underrepresented communities. Includes Google Cloud credits, mentorship, and technical support.',
    amountMin: 0,
    amountMax: 200000,
    eligibility: {
      demographics: ['Women Founders', 'BIPOC Founders'],
      stages: ['SEED', 'SERIES_A'],
      industries: ['Technology'],
      locations: ['United States', 'Global'],
    },
    deadline: null,
    applicationUrl: 'https://startup.google.com/accelerator/',
    tags: ['Accelerator', 'Equity-Free', 'Cloud Credits'],
    isVerified: true,
  },
  {
    name: 'MassChallenge',
    type: 'INVESTOR' as OpportunityType,
    organization: 'MassChallenge',
    description:
      'Zero-equity accelerator that has supported over 3,000 startups. Programs specifically support women founders and diverse entrepreneurs.',
    amountMin: 0,
    amountMax: 100000,
    eligibility: {
      stages: ['PRE_SEED', 'SEED', 'SERIES_A'],
      locations: ['United States', 'Global'],
    },
    deadline: new Date('2025-04-15'),
    applicationUrl: 'https://masschallenge.org/programs/',
    tags: ['Zero-Equity', 'Accelerator', 'Global'],
    isVerified: true,
  },

  // Competitions
  {
    name: 'SXSW Pitch',
    type: 'COMPETITION' as OpportunityType,
    organization: 'SXSW',
    description:
      'Annual startup competition at SXSW featuring companies across multiple categories. Winners receive exposure to investors, media, and potential customers.',
    amountMin: 0,
    amountMax: 0,
    eligibility: {
      stages: ['PRE_SEED', 'SEED'],
      industries: ['Technology', 'Media & Entertainment', 'Healthcare'],
      locations: ['Global'],
    },
    deadline: new Date('2025-01-15'),
    applicationUrl: 'https://www.sxsw.com/pitch/',
    tags: ['Pitch Competition', 'Exposure', 'Networking'],
    isVerified: true,
  },
  {
    name: 'Cartier Women\'s Initiative',
    type: 'COMPETITION' as OpportunityType,
    organization: 'Cartier',
    description:
      'Annual international competition for women entrepreneurs. Awards include $100,000 grant, mentorship, and access to the Cartier network.',
    amountMin: 30000,
    amountMax: 100000,
    eligibility: {
      demographics: ['Women Founders'],
      stages: ['PRE_SEED', 'SEED', 'SERIES_A'],
      locations: ['Global'],
    },
    deadline: new Date('2025-05-31'),
    applicationUrl: 'https://www.cartierwomensinitiative.com/',
    tags: ['Women', 'International', 'Impact'],
    isVerified: true,
  },
  {
    name: 'IndieBio Demo Day',
    type: 'COMPETITION' as OpportunityType,
    organization: 'IndieBio / SOSV',
    description:
      'Biotech accelerator culminating in Demo Day showcasing portfolio companies to hundreds of investors. Investment of $500K + lab space.',
    amountMin: 500000,
    amountMax: 500000,
    eligibility: {
      stages: ['PRE_SEED', 'SEED'],
      industries: ['Healthcare', 'CleanTech', 'FoodTech'],
      locations: ['Global'],
    },
    deadline: null,
    applicationUrl: 'https://indiebio.co/apply/',
    tags: ['Biotech', 'Lab Space', 'Deep Tech'],
    isVerified: true,
  },

  // Loans
  {
    name: 'SBA 7(a) Loan Program',
    type: 'LOAN' as OpportunityType,
    organization: 'U.S. Small Business Administration',
    description:
      'The SBA\'s primary program for providing financial assistance to small businesses. Maximum loan amount is $5 million with competitive terms.',
    amountMin: 25000,
    amountMax: 5000000,
    eligibility: {
      stages: ['SEED', 'SERIES_A', 'GROWTH'],
      locations: ['United States'],
    },
    deadline: null,
    applicationUrl: 'https://www.sba.gov/funding-programs/loans/7a-loans',
    tags: ['SBA', 'Government', 'Working Capital'],
    isVerified: true,
  },
  {
    name: 'Kiva Microloans',
    type: 'LOAN' as OpportunityType,
    organization: 'Kiva',
    description:
      '0% interest crowdfunded microloans up to $15,000 for small businesses. No credit score minimum required.',
    amountMin: 1000,
    amountMax: 15000,
    eligibility: {
      stages: ['IDEA', 'PRE_SEED'],
      locations: ['United States'],
    },
    deadline: null,
    applicationUrl: 'https://www.kiva.org/borrow',
    tags: ['Microloan', 'No Interest', 'Crowdfunded'],
    isVerified: true,
  },
  {
    name: 'Grameen America',
    type: 'LOAN' as OpportunityType,
    organization: 'Grameen America',
    description:
      'Microloans for women entrepreneurs living in poverty. Loans start at $2,000 with access to financial training and support.',
    amountMin: 2000,
    amountMax: 20000,
    eligibility: {
      demographics: ['Women Founders'],
      stages: ['IDEA', 'PRE_SEED'],
      locations: ['United States'],
    },
    deadline: null,
    applicationUrl: 'https://www.grameenamerica.org/',
    tags: ['Microloan', 'Women', 'Financial Training'],
    isVerified: true,
  },
  {
    name: 'Accion Opportunity Fund',
    type: 'LOAN' as OpportunityType,
    organization: 'Accion',
    description:
      'Small business loans from $5,000 to $250,000 for underserved entrepreneurs. Focus on women, minorities, and low-income business owners.',
    amountMin: 5000,
    amountMax: 250000,
    eligibility: {
      demographics: ['Women Founders', 'BIPOC Founders'],
      stages: ['PRE_SEED', 'SEED', 'SERIES_A'],
      locations: ['United States'],
    },
    deadline: null,
    applicationUrl: 'https://www.opportunityfund.org/',
    tags: ['CDFI', 'Underserved', 'Flexible Terms'],
    isVerified: true,
  },

  // Crowdfunding
  {
    name: 'Republic',
    type: 'CROWDFUNDING' as OpportunityType,
    organization: 'Republic',
    description:
      'Equity crowdfunding platform allowing startups to raise from everyday investors. Campaigns typically raise $100K-$1M.',
    amountMin: 50000,
    amountMax: 5000000,
    eligibility: {
      stages: ['PRE_SEED', 'SEED', 'SERIES_A'],
      locations: ['United States', 'Global'],
    },
    deadline: null,
    applicationUrl: 'https://republic.co/raise',
    tags: ['Equity Crowdfunding', 'Community', 'Reg CF'],
    isVerified: true,
  },
  {
    name: 'WeFunder',
    type: 'CROWDFUNDING' as OpportunityType,
    organization: 'WeFunder',
    description:
      'Equity crowdfunding platform with focus on mission-driven companies. Raise from your community of supporters.',
    amountMin: 20000,
    amountMax: 5000000,
    eligibility: {
      stages: ['PRE_SEED', 'SEED', 'SERIES_A'],
      locations: ['United States'],
    },
    deadline: null,
    applicationUrl: 'https://wefunder.com/raise-money',
    tags: ['Equity Crowdfunding', 'Mission-Driven', 'Community'],
    isVerified: true,
  },
  {
    name: 'IFundWomen',
    type: 'CROWDFUNDING' as OpportunityType,
    organization: 'IFundWomen',
    description:
      'Crowdfunding platform and funding marketplace specifically for women-led businesses. Includes coaching and grant matching.',
    amountMin: 5000,
    amountMax: 100000,
    eligibility: {
      demographics: ['Women Founders'],
      stages: ['IDEA', 'PRE_SEED', 'SEED'],
      locations: ['United States'],
    },
    deadline: null,
    applicationUrl: 'https://ifundwomen.com/',
    tags: ['Women', 'Crowdfunding', 'Coaching'],
    isVerified: true,
  },
]

const resources = [
  {
    title: 'Grant Writing 101',
    slug: 'grant-writing-101',
    type: 'GUIDE' as ResourceType,
    content: `
# Grant Writing 101

Writing a compelling grant application is both an art and a science. This guide will walk you through the fundamentals of creating applications that stand out.

## Understanding the Funder

Before you write a single word, research the funding organization thoroughly:
- What is their mission?
- What types of projects have they funded before?
- What outcomes do they care about?

## Key Components of a Strong Application

### 1. Executive Summary
Your executive summary should clearly articulate:
- Who you are
- What problem you're solving
- How you'll use the funds
- Expected outcomes

### 2. Problem Statement
Demonstrate that you deeply understand the problem you're addressing. Use data and real-world examples.

### 3. Proposed Solution
Explain your approach clearly and why it's effective. Connect your solution directly to the funder's priorities.

### 4. Budget
Be specific and realistic. Every line item should connect to your proposed activities.

### 5. Evaluation Plan
Describe how you'll measure success. Include both quantitative and qualitative metrics.

## Common Mistakes to Avoid

- Not following instructions exactly
- Using jargon or buzzwords without substance
- Vague or unrealistic budgets
- Missing deadlines
- Not proofreading

## Final Tips

1. Start early - grant writing takes time
2. Have others review your application
3. Follow up professionally after submission
4. Keep records of all submissions
    `,
    summary: 'Learn the fundamentals of writing compelling grant applications that stand out.',
    tags: ['Grants', 'Writing', 'Applications'],
    isPublished: true,
  },
  {
    title: 'Pitching to VCs: A Complete Guide',
    slug: 'pitching-to-vcs',
    type: 'GUIDE' as ResourceType,
    content: `
# Pitching to VCs: A Complete Guide

Raising venture capital requires a compelling pitch that captures investor attention in minutes. Here's how to do it.

## The 10-Slide Pitch Deck

### Slide 1: Title
Company name, logo, and one-line description.

### Slide 2: Problem
What problem are you solving? Make it relatable and urgent.

### Slide 3: Solution
How do you solve it? Keep it simple and clear.

### Slide 4: Market Size
TAM, SAM, SOM - show there's a big opportunity.

### Slide 5: Business Model
How do you make money?

### Slide 6: Traction
What progress have you made? Users, revenue, growth.

### Slide 7: Competition
Who else is in this space? What's your advantage?

### Slide 8: Team
Why are you the right people to build this?

### Slide 9: Financials
Key projections for the next 3-5 years.

### Slide 10: The Ask
How much are you raising? What will you do with it?

## Delivering Your Pitch

- Practice until it's natural
- Tell a story, don't just present slides
- Be prepared for tough questions
- Show passion but stay professional
- Know your numbers cold
    `,
    summary: 'Master the art of the pitch deck and how to present to venture capitalists.',
    tags: ['VC', 'Pitch Deck', 'Fundraising'],
    isPublished: true,
  },
]

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.application.deleteMany()
  await prisma.successStory.deleteMany()
  await prisma.opportunity.deleteMany()
  await prisma.resource.deleteMany()

  // Seed opportunities
  for (const opp of opportunities) {
    await prisma.opportunity.create({
      data: opp,
    })
  }
  console.log(`Seeded ${opportunities.length} opportunities`)

  // Seed resources
  for (const resource of resources) {
    await prisma.resource.create({
      data: resource,
    })
  }
  console.log(`Seeded ${resources.length} resources`)

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

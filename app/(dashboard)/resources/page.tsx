import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, FileText, HelpCircle, Lightbulb, ArrowRight } from 'lucide-react'

const guides = [
  {
    id: 'grant-writing-101',
    title: 'Grant Writing 101',
    description: 'Learn the fundamentals of writing compelling grant applications that stand out.',
    category: 'Grants',
    readTime: '10 min',
  },
  {
    id: 'pitching-to-vcs',
    title: 'Pitching to VCs',
    description: 'Master the art of the pitch deck and how to present to venture capitalists.',
    category: 'Investors',
    readTime: '15 min',
  },
  {
    id: 'financial-projections',
    title: 'Creating Financial Projections',
    description: 'Build investor-ready financial models and projections for your startup.',
    category: 'Planning',
    readTime: '12 min',
  },
  {
    id: 'due-diligence',
    title: 'Preparing for Due Diligence',
    description: 'What to expect and how to prepare when investors dive deep into your business.',
    category: 'Investors',
    readTime: '8 min',
  },
  {
    id: 'crowdfunding-success',
    title: 'Crowdfunding Success Strategies',
    description: 'Launch a successful crowdfunding campaign with these proven tactics.',
    category: 'Crowdfunding',
    readTime: '10 min',
  },
  {
    id: 'sba-loans',
    title: 'Navigating SBA Loans',
    description: 'A complete guide to Small Business Administration loan programs and eligibility.',
    category: 'Loans',
    readTime: '12 min',
  },
]

const templates = [
  {
    id: 'pitch-deck',
    title: 'Pitch Deck Template',
    description: 'A proven 10-slide pitch deck structure used by successful startups.',
    downloads: 1234,
  },
  {
    id: 'business-plan',
    title: 'Business Plan Template',
    description: 'Comprehensive business plan template for grant applications.',
    downloads: 892,
  },
  {
    id: 'financial-model',
    title: 'Financial Model Template',
    description: 'Excel-based financial projection model with 3-year forecasts.',
    downloads: 756,
  },
  {
    id: 'grant-tracker',
    title: 'Grant Tracker Spreadsheet',
    description: 'Track multiple grant applications with deadlines and requirements.',
    downloads: 543,
  },
]

const faqs = [
  {
    question: 'What is the difference between grants and loans?',
    answer: 'Grants are free money that doesn\'t need to be repaid, while loans must be repaid with interest. Grants are typically more competitive but have no repayment obligation.',
  },
  {
    question: 'How do I know if I\'m eligible for underrepresented founder programs?',
    answer: 'Eligibility varies by program. Many require founders to self-identify as women, BIPOC, LGBTQ+, veterans, or disabled. Check each opportunity\'s specific requirements.',
  },
  {
    question: 'What should I include in a pitch deck?',
    answer: 'Key elements include: problem statement, solution, market size, business model, traction, team, financials, and ask (how much funding you need).',
  },
  {
    question: 'How long does the grant application process take?',
    answer: 'It varies widely. Some grants have quick turnarounds (2-4 weeks), while others may take 3-6 months from application to award.',
  },
  {
    question: 'Can I apply for multiple funding opportunities at once?',
    answer: 'Yes! In fact, it\'s recommended to have multiple applications in progress. Use our tracker to manage them all effectively.',
  },
]

const glossary = [
  { term: 'Pre-seed', definition: 'The earliest stage of startup funding, typically used for initial product development and market research.' },
  { term: 'Seed Round', definition: 'First official equity funding stage, usually ranging from $500K to $2M.' },
  { term: 'Series A', definition: 'First significant round of venture capital financing, typically $2M-$15M.' },
  { term: 'Dilution', definition: 'The reduction in ownership percentage that occurs when new shares are issued.' },
  { term: 'Valuation', definition: 'The estimated worth of a company, used to determine how much equity investors receive.' },
  { term: 'Term Sheet', definition: 'A non-binding agreement outlining the basic terms and conditions of an investment.' },
  { term: 'Cap Table', definition: 'A spreadsheet showing the equity ownership structure of a company.' },
  { term: 'CDFI', definition: 'Community Development Financial Institution - organizations that provide credit to underserved communities.' },
]

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resource Library</h1>
        <p className="text-muted-foreground">
          Guides, templates, and tools to help you secure funding.
        </p>
      </div>

      <Tabs defaultValue="guides" className="space-y-6">
        <TabsList>
          <TabsTrigger value="guides" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Guides
          </TabsTrigger>
          <TabsTrigger value="templates" className="gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="faq" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="glossary" className="gap-2">
            <Lightbulb className="h-4 w-4" />
            Glossary
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guides">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <Card key={guide.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{guide.category}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {guide.readTime} read
                    </span>
                  </div>
                  <CardTitle className="text-lg">{guide.title}</CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Read Guide
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid gap-4 md:grid-cols-2">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {template.downloads.toLocaleString()} downloads
                    </span>
                    <Button>Download</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Common questions about funding and the application process.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-semibold">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                  {index < faqs.length - 1 && <hr className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="glossary">
          <Card>
            <CardHeader>
              <CardTitle>Funding Glossary</CardTitle>
              <CardDescription>
                Key terms and definitions in the world of startup funding.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {glossary.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <h4 className="font-semibold">{item.term}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.definition}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatCurrency } from '@/lib/utils'
import { Quote, ArrowRight, Sparkles } from 'lucide-react'

const stories = [
  {
    id: '1',
    title: 'How I Secured $100K in Grant Funding as a First-Time Founder',
    excerpt:
      'After being rejected by traditional investors, I discovered grant opportunities for women in tech. Here\'s how FundMatch helped me find the right fit.',
    author: {
      name: 'Sarah Chen',
      role: 'Founder, TechBridge AI',
      image: null,
    },
    fundingAmount: 100000,
    fundingType: 'Grant',
    tags: ['Women Founders', 'Tech', 'First-Time Founder'],
    isFeatured: true,
  },
  {
    id: '2',
    title: 'From Idea to Series A: A BIPOC Founder\'s Journey',
    excerpt:
      'Building a fintech startup as a Black founder came with unique challenges. Programs focused on underrepresented founders were game-changers.',
    author: {
      name: 'Marcus Johnson',
      role: 'CEO, EquityPay',
      image: null,
    },
    fundingAmount: 2500000,
    fundingType: 'Series A',
    tags: ['BIPOC Founders', 'FinTech', 'Series A'],
    isFeatured: true,
  },
  {
    id: '3',
    title: 'Veteran Founder Raises Seed Round for AgTech Startup',
    excerpt:
      'My military background taught me discipline, but I needed funding expertise. Here\'s how veteran-focused programs helped launch my startup.',
    author: {
      name: 'James Miller',
      role: 'Founder, CropTech Solutions',
      image: null,
    },
    fundingAmount: 750000,
    fundingType: 'Seed',
    tags: ['Veteran Founders', 'AgTech', 'Seed'],
    isFeatured: false,
  },
  {
    id: '4',
    title: 'Winning a Pitch Competition Changed Everything',
    excerpt:
      'I was hesitant to enter pitch competitions, but the exposure and prize money kickstarted my business. Here\'s my experience.',
    author: {
      name: 'Priya Patel',
      role: 'Founder, EcoStyle',
      image: null,
    },
    fundingAmount: 50000,
    fundingType: 'Competition',
    tags: ['Pitch Competition', 'Sustainability', 'E-commerce'],
    isFeatured: false,
  },
  {
    id: '5',
    title: 'How CDFI Loans Helped Me Start My Small Business',
    excerpt:
      'Traditional banks turned me down, but community development financial institutions gave me a chance. Here\'s what I learned.',
    author: {
      name: 'Maria Rodriguez',
      role: 'Owner, Sabor Latino',
      image: null,
    },
    fundingAmount: 35000,
    fundingType: 'Loan',
    tags: ['CDFI', 'Food & Beverage', 'Small Business'],
    isFeatured: false,
  },
  {
    id: '6',
    title: 'Building an Accessible Tech Company as a Disabled Founder',
    excerpt:
      'Disability-focused funding programs not only provided capital but connected me with a community of supportive founders.',
    author: {
      name: 'Alex Thompson',
      role: 'Founder, AccessTech',
      image: null,
    },
    fundingAmount: 200000,
    fundingType: 'Grant',
    tags: ['Disability Inclusion', 'Accessibility', 'Tech'],
    isFeatured: true,
  },
]

function StoryCard({ story }: { story: (typeof stories)[0] }) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        {story.isFeatured && (
          <Badge className="w-fit mb-2 gap-1">
            <Sparkles className="h-3 w-3" />
            Featured
          </Badge>
        )}
        <div className="flex items-center gap-3 mb-3">
          <Avatar>
            <AvatarImage src={story.author.image || undefined} />
            <AvatarFallback>
              {story.author.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{story.author.name}</p>
            <p className="text-xs text-muted-foreground">{story.author.role}</p>
          </div>
        </div>
        <h3 className="text-lg font-semibold line-clamp-2">{story.title}</h3>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          {story.excerpt}
        </p>
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary">{story.fundingType}</Badge>
          <span className="text-sm font-semibold text-green-600">
            {formatCurrency(story.fundingAmount)}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {story.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Read Story
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function StoriesPage() {
  const featuredStories = stories.filter((s) => s.isFeatured)
  const otherStories = stories.filter((s) => !s.isFeatured)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            Founder Success Stories
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Real Founders.{' '}
            <span className="gradient-text">Real Funding Success.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Learn from founders who have successfully secured funding through
            grants, investors, and competitions.
          </p>
          <Link href="/signup">
            <Button size="lg">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-12 container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Featured Stories</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredStories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Quote className="h-12 w-12 mx-auto mb-6 text-primary/50" />
            <blockquote className="text-2xl font-medium mb-6">
              &ldquo;The funding opportunities I found through FundMatch were
              specifically designed for founders like me. It made all the
              difference in my journey.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="font-semibold">Sarah Chen</p>
                <p className="text-sm text-muted-foreground">
                  Founder, TechBridge AI
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Stories */}
      <section className="py-12 container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">More Success Stories</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {otherStories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 gradient-bg text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Have a Success Story to Share?
          </h2>
          <p className="text-lg opacity-90 max-w-xl mx-auto mb-6">
            Inspire other founders by sharing your funding journey. Your story
            could help someone take their first step.
          </p>
          <Button size="lg" variant="secondary">
            Submit Your Story
          </Button>
        </div>
      </section>
    </div>
  )
}

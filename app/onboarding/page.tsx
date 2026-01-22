'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'

const stages = [
  { value: 'IDEA', label: 'Idea Stage' },
  { value: 'PRE_SEED', label: 'Pre-Seed' },
  { value: 'SEED', label: 'Seed' },
  { value: 'SERIES_A', label: 'Series A' },
  { value: 'SERIES_B', label: 'Series B+' },
  { value: 'GROWTH', label: 'Growth' },
]

const industries = [
  'Technology',
  'Healthcare',
  'FinTech',
  'EdTech',
  'E-commerce',
  'CleanTech',
  'FoodTech',
  'AgTech',
  'Real Estate',
  'Media & Entertainment',
  'Consumer Goods',
  'Manufacturing',
  'Transportation',
  'Social Impact',
  'Other',
]

const businessModels = [
  { value: 'B2B', label: 'B2B (Business to Business)' },
  { value: 'B2C', label: 'B2C (Business to Consumer)' },
  { value: 'B2B2C', label: 'B2B2C (Hybrid)' },
  { value: 'MARKETPLACE', label: 'Marketplace' },
  { value: 'SAAS', label: 'SaaS' },
  { value: 'NONPROFIT', label: 'Nonprofit' },
  { value: 'OTHER', label: 'Other' },
]

const geographicFocuses = [
  { value: 'LOCAL', label: 'Local (City/County)' },
  { value: 'REGIONAL', label: 'Regional (State/Region)' },
  { value: 'NATIONAL', label: 'National' },
  { value: 'GLOBAL', label: 'Global' },
]

interface FormData {
  name: string
  location: string
  companyName: string
  stage: string
  industries: string[]
  businessModel: string
  teamSize: number
  fundingSoughtMin: number
  fundingSoughtMax: number
  geographicFocus: string
  revenue: number
  demographics: {
    genderIdentity: string
    raceEthnicity: string[]
    veteranStatus: boolean
    disabilityStatus: boolean
  }
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [formData, setFormData] = useState<FormData>({
    name: user?.user_metadata?.full_name || '',
    location: '',
    companyName: '',
    stage: 'IDEA',
    industries: [],
    businessModel: '',
    teamSize: 1,
    fundingSoughtMin: 0,
    fundingSoughtMax: 100000,
    geographicFocus: 'NATIONAL',
    revenue: 0,
    demographics: {
      genderIdentity: '',
      raceEthnicity: [],
      veteranStatus: false,
      disabilityStatus: false,
    },
  })

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const updateDemographics = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      demographics: { ...prev.demographics, [field]: value },
    }))
  }

  const toggleIndustry = (industry: string) => {
    setFormData((prev) => ({
      ...prev,
      industries: prev.industries.includes(industry)
        ? prev.industries.filter((i) => i !== industry)
        : [...prev.industries, industry],
    }))
  }

  const toggleEthnicity = (ethnicity: string) => {
    setFormData((prev) => ({
      ...prev,
      demographics: {
        ...prev.demographics,
        raceEthnicity: prev.demographics.raceEthnicity.includes(ethnicity)
          ? prev.demographics.raceEthnicity.filter((e) => e !== ethnicity)
          : [...prev.demographics.raceEthnicity, ethnicity],
      },
    }))
  }

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/profile/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to save profile')
      }

      toast({
        title: 'Profile Complete!',
        description: 'Welcome to FundMatch. Let\'s find you some funding opportunities!',
      })

      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save your profile. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">FundMatch</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Let&apos;s Set Up Your Profile</h1>
          <p className="text-muted-foreground">
            This helps us find the best funding opportunities for you.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Steps */}
        <Card>
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Tell us about yourself and where you&apos;re located.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => updateFormData('location', e.target.value)}
                    placeholder="San Francisco, CA"
                  />
                  <p className="text-xs text-muted-foreground">
                    Some opportunities are location-specific.
                  </p>
                </div>
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle>Business Details</CardTitle>
                <CardDescription>
                  Help us understand your business better.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => updateFormData('companyName', e.target.value)}
                    placeholder="Acme Inc."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Business Stage</Label>
                  <Select
                    value={formData.stage}
                    onValueChange={(value) => updateFormData('stage', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map((stage) => (
                        <SelectItem key={stage.value} value={stage.value}>
                          {stage.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Industries (select all that apply)</Label>
                  <div className="flex flex-wrap gap-2">
                    {industries.map((industry) => (
                      <button
                        key={industry}
                        type="button"
                        onClick={() => toggleIndustry(industry)}
                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                          formData.industries.includes(industry)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background hover:bg-muted border-input'
                        }`}
                      >
                        {industry}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Business Model</Label>
                  <Select
                    value={formData.businessModel}
                    onValueChange={(value) => updateFormData('businessModel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessModels.map((model) => (
                        <SelectItem key={model.value} value={model.value}>
                          {model.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamSize">Team Size</Label>
                  <Input
                    id="teamSize"
                    type="number"
                    min={1}
                    value={formData.teamSize}
                    onChange={(e) =>
                      updateFormData('teamSize', parseInt(e.target.value) || 1)
                    }
                  />
                </div>
              </CardContent>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle>Funding Needs</CardTitle>
                <CardDescription>
                  What are you looking for in terms of funding?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fundingMin">Minimum Amount ($)</Label>
                    <Input
                      id="fundingMin"
                      type="number"
                      min={0}
                      step={1000}
                      value={formData.fundingSoughtMin}
                      onChange={(e) =>
                        updateFormData('fundingSoughtMin', parseInt(e.target.value) || 0)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fundingMax">Maximum Amount ($)</Label>
                    <Input
                      id="fundingMax"
                      type="number"
                      min={0}
                      step={1000}
                      value={formData.fundingSoughtMax}
                      onChange={(e) =>
                        updateFormData('fundingSoughtMax', parseInt(e.target.value) || 0)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Geographic Focus</Label>
                  <Select
                    value={formData.geographicFocus}
                    onValueChange={(value) => updateFormData('geographicFocus', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select focus" />
                    </SelectTrigger>
                    <SelectContent>
                      {geographicFocuses.map((focus) => (
                        <SelectItem key={focus.value} value={focus.value}>
                          {focus.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="revenue">Current Annual Revenue ($)</Label>
                  <Input
                    id="revenue"
                    type="number"
                    min={0}
                    step={1000}
                    value={formData.revenue}
                    onChange={(e) =>
                      updateFormData('revenue', parseInt(e.target.value) || 0)
                    }
                    placeholder="0 if pre-revenue"
                  />
                </div>
              </CardContent>
            </>
          )}

          {step === 4 && (
            <>
              <CardHeader>
                <CardTitle>Demographics (Optional)</CardTitle>
                <CardDescription>
                  This information helps us match you with opportunities specifically
                  designed for underrepresented founders. All fields are optional and
                  your data is kept private.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Gender Identity</Label>
                  <Select
                    value={formData.demographics.genderIdentity}
                    onValueChange={(value) => updateDemographics('genderIdentity', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Prefer not to say" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="woman">Woman</SelectItem>
                      <SelectItem value="man">Man</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="lgbtq">LGBTQ+</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Race/Ethnicity (select all that apply)</Label>
                  <div className="space-y-2">
                    {[
                      'Black or African American',
                      'Hispanic or Latino',
                      'Asian',
                      'Native American or Alaska Native',
                      'Native Hawaiian or Pacific Islander',
                      'Middle Eastern or North African',
                      'Two or more races',
                      'Prefer not to say',
                    ].map((ethnicity) => (
                      <div key={ethnicity} className="flex items-center space-x-2">
                        <Checkbox
                          id={ethnicity}
                          checked={formData.demographics.raceEthnicity.includes(ethnicity)}
                          onCheckedChange={() => toggleEthnicity(ethnicity)}
                        />
                        <label
                          htmlFor={ethnicity}
                          className="text-sm leading-none cursor-pointer"
                        >
                          {ethnicity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="veteran"
                    checked={formData.demographics.veteranStatus}
                    onCheckedChange={(checked) =>
                      updateDemographics('veteranStatus', checked)
                    }
                  />
                  <label htmlFor="veteran" className="text-sm leading-none cursor-pointer">
                    I am a veteran
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="disability"
                    checked={formData.demographics.disabilityStatus}
                    onCheckedChange={(checked) =>
                      updateDemographics('disabilityStatus', checked)
                    }
                  />
                  <label htmlFor="disability" className="text-sm leading-none cursor-pointer">
                    I identify as having a disability
                  </label>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Why we ask:</strong> Many funding opportunities are specifically
                    designed for underrepresented founders. Sharing this information (optional)
                    helps us surface relevant opportunities. Your data is never shared with
                    third parties without your consent.
                  </p>
                </div>
              </CardContent>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between p-6 pt-0">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            {step < totalSteps ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  'Saving...'
                ) : (
                  <>
                    Complete Setup
                    <CheckCircle2 className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>

        {/* Skip Option */}
        <div className="text-center mt-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  )
}

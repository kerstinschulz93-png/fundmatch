'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

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

interface ProfileData {
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

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [formData, setFormData] = useState<ProfileData>({
    name: '',
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

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setFormData({
          name: data.user?.name || '',
          location: data.profile?.location || '',
          companyName: data.profile?.companyName || '',
          stage: data.profile?.stage || 'IDEA',
          industries: data.profile?.industries || [],
          businessModel: data.profile?.businessModel || '',
          teamSize: data.profile?.teamSize || 1,
          fundingSoughtMin: data.profile?.fundingSoughtMin || 0,
          fundingSoughtMax: data.profile?.fundingSoughtMax || 100000,
          geographicFocus: data.profile?.geographicFocus || 'NATIONAL',
          revenue: data.profile?.revenue || 0,
          demographics: data.profile?.demographics || {
            genderIdentity: '',
            raceEthnicity: [],
            veteranStatus: false,
            disabilityStatus: false,
          },
        })
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been saved successfully.',
      })

      router.refresh()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your founder profile to get better opportunity matches.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Your personal and location details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Details */}
        <Card>
          <CardHeader>
            <CardTitle>Business Details</CardTitle>
            <CardDescription>
              Information about your company and business.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => updateFormData('companyName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Business Stage</Label>
                <Select
                  value={formData.stage}
                  onValueChange={(value) => updateFormData('stage', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
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
            </div>

            <div className="space-y-2">
              <Label>Industries</Label>
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

            <div className="grid gap-4 md:grid-cols-2">
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
            </div>
          </CardContent>
        </Card>

        {/* Funding Needs */}
        <Card>
          <CardHeader>
            <CardTitle>Funding Needs</CardTitle>
            <CardDescription>
              Your funding requirements and financial details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fundingMin">Minimum Funding Sought ($)</Label>
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
                <Label htmlFor="fundingMax">Maximum Funding Sought ($)</Label>
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
              />
            </div>
          </CardContent>
        </Card>

        {/* Demographics */}
        <Card>
          <CardHeader>
            <CardTitle>Demographics (Optional)</CardTitle>
            <CardDescription>
              This helps us match you with opportunities for underrepresented founders.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Label>Race/Ethnicity</Label>
              <div className="grid grid-cols-2 gap-2">
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
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}

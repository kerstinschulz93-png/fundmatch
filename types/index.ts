import {
  User,
  FounderProfile,
  Opportunity,
  Application,
  SuccessStory,
  Resource,
  Stage,
  OpportunityType,
  ApplicationStatus,
  ResourceType,
} from '@prisma/client'

// Re-export Prisma types
export type {
  User,
  FounderProfile,
  Opportunity,
  Application,
  SuccessStory,
  Resource,
}

export { Stage, OpportunityType, ApplicationStatus, ResourceType }

// Extended types
export type UserWithProfile = User & {
  founderProfile: FounderProfile | null
}

export type OpportunityWithApplications = Opportunity & {
  applications: Application[]
}

export type ApplicationWithOpportunity = Application & {
  opportunity: Opportunity
}

export type SuccessStoryWithRelations = SuccessStory & {
  user: Pick<User, 'id' | 'name' | 'image'>
  opportunity: Opportunity | null
}

// Form types
export interface OnboardingFormData {
  // Step 1: Basic Info
  name: string
  location: string

  // Step 2: Business Details
  companyName: string
  stage: Stage
  industries: string[]
  businessModel: string
  teamSize: number

  // Step 3: Funding Needs
  fundingSoughtMin: number
  fundingSoughtMax: number
  geographicFocus: string
  revenue?: number

  // Step 4: Demographics (optional)
  demographics?: {
    genderIdentity?: string
    raceEthnicity?: string[]
    veteranStatus?: boolean
    disabilityStatus?: boolean
  }
}

export interface OpportunityFilters {
  type?: OpportunityType[]
  amountMin?: number
  amountMax?: number
  deadlineFrom?: Date
  deadlineTo?: Date
  stages?: Stage[]
  industries?: string[]
  location?: string
  search?: string
}

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Match result type
export interface MatchResult {
  opportunity: Opportunity
  score: number
  reasons: string[]
}

// Kanban column type
export interface KanbanColumn {
  id: ApplicationStatus
  title: string
  applications: ApplicationWithOpportunity[]
}

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Search, SlidersHorizontal, X } from 'lucide-react'

const opportunityTypes = [
  { value: 'GRANT', label: 'Grants' },
  { value: 'INVESTOR', label: 'Investors' },
  { value: 'LOAN', label: 'Loans' },
  { value: 'COMPETITION', label: 'Competitions' },
  { value: 'CROWDFUNDING', label: 'Crowdfunding' },
]

const sortOptions = [
  { value: 'match', label: 'Best Match' },
  { value: 'newest', label: 'Newest' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'amount', label: 'Amount' },
]

export function OpportunityFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    searchParams.get('type')?.split(',').filter(Boolean) || []
  )

  const updateFilters = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })

      router.push(`/opportunities?${params.toString()}`)
    },
    [router, searchParams]
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ search })
  }

  const handleTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked
      ? [...selectedTypes, type]
      : selectedTypes.filter((t) => t !== type)
    setSelectedTypes(newTypes)
    updateFilters({ type: newTypes.length > 0 ? newTypes.join(',') : null })
  }

  const handleSortChange = (value: string) => {
    updateFilters({ sort: value === 'match' ? null : value })
  }

  const handleDeadlineChange = (value: string) => {
    updateFilters({ deadline: value === 'all' ? null : value })
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedTypes([])
    router.push('/opportunities')
  }

  const hasFilters =
    search ||
    selectedTypes.length > 0 ||
    searchParams.get('deadline') ||
    searchParams.get('minAmount') ||
    searchParams.get('maxAmount')

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search opportunities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        {/* Sort */}
        <Select
          value={searchParams.get('sort') || 'match'}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filters Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasFilters && (
                <span className="ml-1 rounded-full bg-primary text-primary-foreground w-5 h-5 text-xs flex items-center justify-center">
                  !
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {opportunityTypes.map((type) => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.value}
                        checked={selectedTypes.includes(type.value)}
                        onCheckedChange={(checked) =>
                          handleTypeChange(type.value, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={type.value}
                        className="text-sm cursor-pointer"
                      >
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Deadline</Label>
                <Select
                  value={searchParams.get('deadline') || 'all'}
                  onValueChange={handleDeadlineChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="rolling">Rolling</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Amount Range</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    defaultValue={searchParams.get('minAmount') || ''}
                    onChange={(e) =>
                      updateFilters({ minAmount: e.target.value || null })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    defaultValue={searchParams.get('maxAmount') || ''}
                    onChange={(e) =>
                      updateFilters({ maxAmount: e.target.value || null })
                    }
                  />
                </div>
              </div>

              {hasFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="w-full"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters Display */}
      {selectedTypes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTypes.map((type) => (
            <Button
              key={type}
              variant="secondary"
              size="sm"
              onClick={() => handleTypeChange(type, false)}
              className="h-7"
            >
              {opportunityTypes.find((t) => t.value === type)?.label}
              <X className="ml-1 h-3 w-3" />
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

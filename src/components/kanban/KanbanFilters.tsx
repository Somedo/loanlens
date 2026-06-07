'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X } from 'lucide-react'

type DatePreset = 'all' | 'today' | 'last7' | 'last30' | 'custom'

interface KanbanFiltersProps {
  onSearchChange: (search: string) => void
  onPriorityChange: (priority: string | null) => void
  onDateRangeChange: (from: Date | null, to: Date | null) => void
  currentSearch: string
  currentPriority: string | null
  activeFiltersCount: number
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function endOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999)
}

export function KanbanFilters({
  onSearchChange,
  onPriorityChange,
  onDateRangeChange,
  currentSearch,
  currentPriority,
  activeFiltersCount,
}: KanbanFiltersProps) {
  const [inputValue, setInputValue] = useState(currentSearch)
  const [datePreset, setDatePreset] = useState<DatePreset>('all')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  // Use ref to avoid stale closure in debounce without re-registering the effect
  const onSearchChangeRef = useRef(onSearchChange)
  onSearchChangeRef.current = onSearchChange

  // Debounce: only fires when inputValue changes
  useEffect(() => {
    const t = setTimeout(() => onSearchChangeRef.current(inputValue), 300)
    return () => clearTimeout(t)
  }, [inputValue])

  const applyPreset = (preset: DatePreset) => {
    setDatePreset(preset)
    const now = new Date()
    const today = startOfDay(now)

    switch (preset) {
      case 'all':
        onDateRangeChange(null, null)
        break
      case 'today':
        onDateRangeChange(today, endOfDay(now))
        break
      case 'last7': {
        const from = new Date(today)
        from.setDate(from.getDate() - 6)
        onDateRangeChange(from, endOfDay(now))
        break
      }
      case 'last30': {
        const from = new Date(today)
        from.setDate(from.getDate() - 29)
        onDateRangeChange(from, endOfDay(now))
        break
      }
      case 'custom':
        // Reset to null until user picks specific dates
        setCustomFrom('')
        setCustomTo('')
        onDateRangeChange(null, null)
        break
    }
  }

  const handleCustomFrom = (val: string) => {
    setCustomFrom(val)
    const from = val ? startOfDay(new Date(val + 'T12:00:00')) : null
    const to = customTo ? endOfDay(new Date(customTo + 'T12:00:00')) : null
    onDateRangeChange(from, to)
  }

  const handleCustomTo = (val: string) => {
    setCustomTo(val)
    const from = customFrom ? startOfDay(new Date(customFrom + 'T12:00:00')) : null
    const to = val ? endOfDay(new Date(val + 'T12:00:00')) : null
    onDateRangeChange(from, to)
  }

  const handleClearAll = () => {
    setInputValue('')
    setDatePreset('all')
    setCustomFrom('')
    setCustomTo('')
    onSearchChangeRef.current('')
    onPriorityChange(null)
    onDateRangeChange(null, null)
  }

  const datePresetLabel: Record<DatePreset, string> = {
    all: 'All Time',
    today: 'Today',
    last7: 'Last 7 Days',
    last30: 'Last 30 Days',
    custom: 'Custom Range',
  }

  return (
    <div className="mb-5 space-y-2">
      {/* Main filter row */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search deals by title or client..."
            className="pl-9 pr-8"
          />
          {inputValue && (
            <button
              onClick={() => setInputValue('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Priority */}
        <Select
          value={currentPriority ?? 'all'}
          onValueChange={(v) => onPriorityChange(v === 'all' ? null : v)}
        >
          <SelectTrigger className="w-38">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Low
              </span>
            </SelectItem>
            <SelectItem value="medium">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
                Medium
              </span>
            </SelectItem>
            <SelectItem value="high">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                High
              </span>
            </SelectItem>
            <SelectItem value="urgent">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                Urgent
              </span>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range Preset */}
        <Select
          value={datePreset}
          onValueChange={(v) => applyPreset(v as DatePreset)}
        >
          <SelectTrigger className="w-38">
            <SelectValue>{datePresetLabel[datePreset]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="last7">Last 7 Days</SelectItem>
            <SelectItem value="last30">Last 30 Days</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear button */}
        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="gap-1.5 shrink-0"
          >
            <X className="h-3.5 w-3.5" />
            Clear Filters ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Custom date inputs — only shown when preset = custom */}
      {datePreset === 'custom' && (
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="text-muted-foreground font-medium">From</span>
          <input
            type="date"
            value={customFrom}
            onChange={(e) => handleCustomFrom(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <span className="text-muted-foreground font-medium">to</span>
          <input
            type="date"
            value={customTo}
            min={customFrom || undefined}
            onChange={(e) => handleCustomTo(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {(customFrom || customTo) && (
            <button
              onClick={() => { handleCustomFrom(''); handleCustomTo('') }}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Clear dates
            </button>
          )}
        </div>
      )}
    </div>
  )
}

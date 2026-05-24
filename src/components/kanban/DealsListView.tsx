'use client'

import { useState, useMemo } from 'react'
import { Deal, DealStage, DealPriority } from './KanbanBoard'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowUpDown, ArrowUp, ArrowDown, Pencil, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface DealsListViewProps {
  deals: Deal[]
  onDealClick: (deal: Deal) => void
  onStageChange: (dealId: string, newStage: string) => void
  onDelete: (dealId: string) => void
}

type SortField = 'title' | 'client_name' | 'stage' | 'priority' | 'loan_amount' | 'ltv_percentage' | 'created_at'

const PRIORITY_COLORS: Record<DealPriority, string> = {
  low: 'bg-gray-100 text-gray-800 border-gray-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  urgent: 'bg-red-100 text-red-800 border-red-200',
}

const STAGE_COLORS: Record<DealStage, string> = {
  lead: 'bg-blue-100 text-blue-800 border-blue-200',
  active: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  completion: 'bg-purple-100 text-purple-800 border-purple-200',
  redeemed: 'bg-green-100 text-green-800 border-green-200',
}

const STAGE_LABELS: Record<DealStage, string> = {
  lead: 'Lead',
  active: 'Active',
  completion: 'Completion',
  redeemed: 'Redeemed',
}

const PRIORITY_ORDER: Record<DealPriority, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
}

function formatCurrency(amount: number | undefined): string {
  if (!amount) return '—'
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function getLtvColor(ltv: number | undefined): string {
  if (!ltv) return ''
  if (ltv < 70) return 'text-green-600 font-semibold'
  if (ltv <= 80) return 'text-yellow-600 font-semibold'
  return 'text-red-600 font-semibold'
}

export function DealsListView({ deals, onDealClick, onStageChange, onDelete }: DealsListViewProps) {
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedDeals = useMemo(() => {
    return [...deals].sort((a, b) => {
      let aVal: string | number | undefined
      let bVal: string | number | undefined

      if (sortField === 'priority') {
        aVal = PRIORITY_ORDER[a.priority]
        bVal = PRIORITY_ORDER[b.priority]
      } else {
        aVal = a[sortField] as string | number | undefined
        bVal = b[sortField] as string | number | undefined
      }

      if (aVal === undefined || aVal === null) return 1
      if (bVal === undefined || bVal === null) return -1
      const direction = sortDirection === 'asc' ? 1 : -1
      if (aVal < bVal) return -direction
      if (aVal > bVal) return direction
      return 0
    })
  }, [deals, sortField, sortDirection])

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />
    return sortDirection === 'asc'
      ? <ArrowUp className="h-3 w-3 ml-1" />
      : <ArrowDown className="h-3 w-3 ml-1" />
  }

  const SortableHeader = ({ field, label }: { field: SortField; label: string }) => (
    <button
      className="flex items-center hover:text-foreground transition-colors"
      onClick={() => handleSort(field)}
    >
      {label}
      <SortIcon field={field} />
    </button>
  )

  const toggleCard = (id: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleDeleteClick = (e: React.MouseEvent, dealId: string) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this deal?')) {
      onDelete(dealId)
    }
  }

  if (deals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-lg font-medium">No deals found</p>
        <p className="text-sm mt-1">Create a new deal to get started</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Desktop / Tablet table */}
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><SortableHeader field="title" label="Title" /></TableHead>
              <TableHead><SortableHeader field="client_name" label="Client" /></TableHead>
              <TableHead><SortableHeader field="stage" label="Stage" /></TableHead>
              <TableHead><SortableHeader field="priority" label="Priority" /></TableHead>
              <TableHead><SortableHeader field="loan_amount" label="Loan Amount" /></TableHead>
              <TableHead><SortableHeader field="ltv_percentage" label="LTV %" /></TableHead>
              <TableHead className="hidden lg:table-cell">
                <SortableHeader field="created_at" label="Created" />
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDeals.map((deal, index) => (
              <TableRow
                key={deal.id}
                className={`cursor-pointer ${index % 2 === 0 ? 'bg-muted/20' : ''}`}
                onClick={() => onDealClick(deal)}
              >
                <TableCell className="font-medium max-w-[200px]">
                  <span className="truncate block">{deal.title}</span>
                </TableCell>
                <TableCell className="text-muted-foreground max-w-[150px]">
                  <span className="truncate block">{deal.client_name || '—'}</span>
                </TableCell>
                <TableCell onClick={e => e.stopPropagation()}>
                  <Select
                    value={deal.stage}
                    onValueChange={value => onStageChange(deal.id, value)}
                  >
                    <SelectTrigger className="w-[130px] h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completion">Completion</SelectItem>
                      <SelectItem value="redeemed">Redeemed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-xs ${PRIORITY_COLORS[deal.priority]}`}>
                    {deal.priority}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {formatCurrency(deal.loan_amount)}
                </TableCell>
                <TableCell>
                  {deal.ltv_percentage ? (
                    <span className={getLtvColor(deal.ltv_percentage)}>
                      {deal.ltv_percentage.toFixed(1)}%
                    </span>
                  ) : '—'}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm hidden lg:table-cell">
                  {formatDistanceToNow(new Date(deal.created_at), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => onDealClick(deal)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                      onClick={e => handleDeleteClick(e, deal.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile card layout */}
      <div className="sm:hidden space-y-3">
        {sortedDeals.map(deal => {
          const isExpanded = expandedCards.has(deal.id)
          return (
            <div key={deal.id} className="border rounded-lg bg-card overflow-hidden">
              <div
                className="flex items-center justify-between p-3 cursor-pointer"
                onClick={() => toggleCard(deal.id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{deal.title}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {deal.client_name || 'No client'}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-2 shrink-0">
                  <Badge variant="outline" className={`text-xs ${STAGE_COLORS[deal.stage]}`}>
                    {STAGE_LABELS[deal.stage]}
                  </Badge>
                  {isExpanded
                    ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    : <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  }
                </div>
              </div>

              {isExpanded && (
                <div className="px-3 pb-3 space-y-3 border-t pt-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Priority</p>
                      <Badge variant="outline" className={`text-xs ${PRIORITY_COLORS[deal.priority]}`}>
                        {deal.priority}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Loan Amount</p>
                      <p className="font-semibold">{formatCurrency(deal.loan_amount)}</p>
                    </div>
                    {deal.ltv_percentage ? (
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">LTV</p>
                        <p className={getLtvColor(deal.ltv_percentage)}>
                          {deal.ltv_percentage.toFixed(1)}%
                        </p>
                      </div>
                    ) : null}
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Created</p>
                      <p>{formatDistanceToNow(new Date(deal.created_at), { addSuffix: true })}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Stage</p>
                    <Select
                      value={deal.stage}
                      onValueChange={value => onStageChange(deal.id, value)}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead">Lead</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completion">Completion</SelectItem>
                        <SelectItem value="redeemed">Redeemed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => onDealClick(deal)}
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-destructive border-destructive/50 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={e => handleDeleteClick(e, deal.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Deal } from './KanbanBoard'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
  GripVertical,
} from 'lucide-react'
import { format } from 'date-fns'

interface DealCardProps {
  deal: Deal
  isDragging?: boolean
}

const PRIORITY_COLORS = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  urgent: 'bg-red-100 text-red-800 border-red-200',
}

export function DealCard({ deal, isDragging }: DealCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: deal.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  }

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
        isDragging ? 'shadow-lg rotate-3' : ''
      }`}
    >
      <div className="space-y-3">
        {/* Header with drag handle and priority */}
        <div className="flex items-start gap-2">
          <div {...attributes} {...listeners} className="mt-1">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{deal.title}</h3>
            {deal.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {deal.description}
              </p>
            )}
          </div>
          <Badge
            variant="outline"
            className={PRIORITY_COLORS[deal.priority]}
          >
            {deal.priority}
          </Badge>
        </div>

        {/* Client Info */}
        {deal.client_name && (
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{deal.client_name}</span>
          </div>
        )}

        {/* Property Address */}
        {deal.property_address && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{deal.property_address}</span>
          </div>
        )}

        {/* Financial Details */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Loan Amount</p>
            <p className="font-semibold text-sm">
              {formatCurrency(deal.loan_amount)}
            </p>
          </div>
          {deal.ltv_percentage && (
            <div>
              <p className="text-xs text-muted-foreground">LTV</p>
              <p className="font-semibold text-sm flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {deal.ltv_percentage}%
              </p>
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="flex gap-2 text-xs text-muted-foreground pt-2 border-t">
          {deal.client_email && (
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              <span className="truncate">{deal.client_email}</span>
            </div>
          )}
          {deal.client_phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>{deal.client_phone}</span>
            </div>
          )}
        </div>

        {/* Footer with date */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>
              Created {format(new Date(deal.created_at), 'MMM d, yyyy')}
            </span>
          </div>
          {deal.stage === 'completion' && deal.completed_at && (
            <span className="text-purple-600 font-medium">
              In completion
            </span>
          )}
          {deal.stage === 'redeemed' && deal.redeemed_at && (
            <span className="text-green-600 font-medium">
              ✓ Closed
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}

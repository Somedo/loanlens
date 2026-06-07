'use client'

import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { DealCard } from './DealCard'
import { Deal } from './KanbanBoard'
import { Loader2 } from 'lucide-react'

interface KanbanColumnProps {
  stage: {
    id: string
    title: string
    emoji: string
    color: string
    headerBg: string
    columnBg: string
  }
  deals: Deal[]
  totalDeals: number
  isFiltered?: boolean
  isLoading?: boolean
  onDealClick?: (deal: Deal) => void
}

export function KanbanColumn({ stage, deals, totalDeals, isFiltered, isLoading, onDealClick }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: stage.id })

  return (
    <div className="w-75 sm:w-80 shrink-0 flex flex-col rounded-xl overflow-hidden shadow-sm border border-border/50">
      {/* Colored header */}
      <div className={`${stage.headerBg} px-4 py-3 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">{stage.emoji}</span>
            <h2 className="font-semibold text-sm tracking-wide">{stage.title}</h2>
          </div>
          <span className="bg-white/25 rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums">
            {isFiltered && deals.length !== totalDeals
              ? `${deals.length} of ${totalDeals}`
              : deals.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="mt-2.5 h-1 bg-white/25 rounded-full">
          <div
            className="h-full bg-white/70 rounded-full transition-all duration-300"
            style={{ width: `${deals.length > 0 ? Math.min((deals.length / 10) * 100, 100) : 0}%` }}
          />
        </div>
      </div>

      {/* Cards container */}
      <div
        ref={setNodeRef}
        className={`flex-1 ${stage.columnBg} p-3 min-h-120`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <SortableContext
            items={deals.map((d) => d.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {deals.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground/60 text-sm">
                  <div className="text-2xl mb-2 opacity-40">{stage.emoji}</div>
                  {isFiltered && totalDeals > 0
                    ? 'No deals match filters'
                    : 'No deals here'}
                </div>
              ) : (
                deals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    onClick={onDealClick ? () => onDealClick(deal) : undefined}
                  />
                ))
              )}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  )
}

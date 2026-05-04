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
    color: string
  }
  deals: Deal[]
  isLoading?: boolean
}

export function KanbanColumn({ stage, deals, isLoading }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: stage.id,
  })

  return (
    <div className="flex-1 min-w-[320px] flex flex-col">
      {/* Column Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${stage.color}`} />
          <h2 className="font-semibold text-lg">{stage.title}</h2>
          <span className="text-sm text-muted-foreground">
            ({deals.length})
          </span>
        </div>
        <div className="h-1 bg-muted rounded-full">
          <div
            className={`h-full rounded-full ${stage.color} transition-all`}
            style={{
              width: `${deals.length > 0 ? Math.min((deals.length / 10) * 100, 100) : 0}%`,
            }}
          />
        </div>
      </div>

      {/* Cards Container */}
      <div
        ref={setNodeRef}
        className="flex-1 bg-muted/20 rounded-lg p-3 min-h-[200px]"
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
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No deals in this stage
                </div>
              ) : (
                deals.map((deal) => <DealCard key={deal.id} deal={deal} />)
              )}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  )
}

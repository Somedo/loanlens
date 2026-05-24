'use client'

import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { KanbanColumn } from './KanbanColumn'
import { DealCard } from './DealCard'

export type DealStage = 'lead' | 'active' | 'completion' | 'redeemed'

export type DealPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Deal {
  id: string
  title: string
  description?: string
  stage: DealStage
  priority: DealPriority
  loan_amount?: number
  property_value?: number
  ltv_percentage?: number
  client_name?: string
  client_email?: string
  client_phone?: string
  property_address?: string
  property_postcode?: string
  broker_id?: string
  assigned_to?: string
  position: number
  created_at: string
  updated_at: string
  stage_changed_at: string
  completed_at?: string
  redeemed_at?: string
}

const STAGES: { id: DealStage; title: string; color: string }[] = [
  { id: 'lead', title: 'Lead', color: 'bg-blue-500' },
  { id: 'active', title: 'Active', color: 'bg-yellow-500' },
  { id: 'completion', title: 'Completion', color: 'bg-purple-500' },
  { id: 'redeemed', title: 'Redeemed', color: 'bg-green-500' },
]

interface KanbanBoardProps {
  deals: Deal[]
  isLoading: boolean
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>
  onRefetch: () => void
}

export function KanbanBoard({ deals, isLoading, setDeals, onRefetch }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const dealsByStage = STAGES.reduce((acc, stage) => {
    acc[stage.id] = deals
      .filter(deal => deal.stage === stage.id)
      .sort((a, b) => a.position - b.position)
    return acc
  }, {} as Record<DealStage, Deal[]>)

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    if (!event.over) return
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeDeal = deals.find(d => d.id === activeId)
    if (!activeDeal) return

    let targetStage = activeDeal.stage
    const overStage = STAGES.find(s => s.id === overId)
    if (overStage) {
      targetStage = overStage.id
    } else {
      const overDeal = deals.find(d => d.id === overId)
      if (overDeal) {
        targetStage = overDeal.stage
      }
    }

    const stageDeals = deals
      .filter(d => d.stage === targetStage)
      .sort((a, b) => a.position - b.position)

    const oldIndex = stageDeals.findIndex(d => d.id === activeId)
    const newIndex = stageDeals.findIndex(d => d.id === overId)

    if (activeDeal.stage !== targetStage || (newIndex >= 0 && oldIndex !== newIndex)) {
      const newPosition = oldIndex === -1 ? (newIndex >= 0 ? newIndex : stageDeals.length) : newIndex

      setDeals(prevDeals =>
        prevDeals.map(deal => {
          if (deal.id === activeId) {
            return { ...deal, stage: targetStage, position: newPosition }
          }
          if (deal.stage === targetStage && deal.id !== activeId) {
            if (deal.position >= newPosition) {
              return { ...deal, position: deal.position + 1 }
            }
          }
          return deal
        })
      )

      try {
        const response = await fetch(`/api/deals/${activeId}/stage`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stage: targetStage, position: newPosition }),
        })
        if (!response.ok) {
          console.error('Failed to save deal move:', response.statusText)
          onRefetch()
        }
      } catch (error) {
        console.error('Failed to save deal move:', error)
        onRefetch()
      }
    }
  }

  const activeDeal = activeId ? deals.find(d => d.id === activeId) : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
        {STAGES.map(stage => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            deals={dealsByStage[stage.id] || []}
            isLoading={isLoading}
          />
        ))}
      </div>

      <DragOverlay>
        {activeDeal ? <DealCard deal={activeDeal} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  )
}

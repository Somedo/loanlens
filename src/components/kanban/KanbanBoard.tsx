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
import { DealDetailsModal } from './DealDetailsModal'

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

interface StageConfig {
  id: DealStage
  title: string
  emoji: string
  color: string
  headerBg: string
  columnBg: string
}

const STAGES: StageConfig[] = [
  {
    id: 'lead',
    title: 'Lead',
    emoji: '📋',
    color: 'bg-blue-500',
    headerBg: 'bg-blue-600',
    columnBg: 'bg-blue-50/60 dark:bg-blue-950/20',
  },
  {
    id: 'active',
    title: 'Active',
    emoji: '⚡',
    color: 'bg-amber-500',
    headerBg: 'bg-amber-500',
    columnBg: 'bg-amber-50/60 dark:bg-amber-950/20',
  },
  {
    id: 'completion',
    title: 'Completion',
    emoji: '✅',
    color: 'bg-violet-500',
    headerBg: 'bg-violet-600',
    columnBg: 'bg-violet-50/60 dark:bg-violet-950/20',
  },
  {
    id: 'redeemed',
    title: 'Redeemed',
    emoji: '💰',
    color: 'bg-emerald-500',
    headerBg: 'bg-emerald-600',
    columnBg: 'bg-emerald-50/60 dark:bg-emerald-950/20',
  },
]

interface KanbanBoardProps {
  deals: Deal[]
  isLoading: boolean
  setDeals: React.Dispatch<React.SetStateAction<Deal[]>>
  onRefetch: () => void
}

export function KanbanBoard({ deals, isLoading, setDeals, onRefetch }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDealClick = (deal: Deal) => {
    setSelectedDeal(deal)
    setIsModalOpen(true)
  }

  const handleSaveDeal = async (updatedDeal: Deal) => {
    const response = await fetch(`/api/deals/${updatedDeal.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: updatedDeal.title,
        description: updatedDeal.description,
        stage: updatedDeal.stage,
        priority: updatedDeal.priority,
        loan_amount: updatedDeal.loan_amount,
        property_value: updatedDeal.property_value,
        ltv_percentage: updatedDeal.ltv_percentage,
        client_name: updatedDeal.client_name,
        client_email: updatedDeal.client_email,
        client_phone: updatedDeal.client_phone,
        property_address: updatedDeal.property_address,
        property_postcode: updatedDeal.property_postcode,
      }),
    })
    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.error ?? 'Failed to save')
    }
    const { deal: saved } = await response.json()
    setDeals(prev => prev.map(d => d.id === updatedDeal.id ? saved : d))
    setSelectedDeal(saved)
  }

  const handleDeleteDeal = async (dealId: string) => {
    const response = await fetch(`/api/deals/${dealId}`, { method: 'DELETE' })
    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.error ?? 'Failed to delete')
    }
    setDeals(prev => prev.filter(d => d.id !== dealId))
    setIsModalOpen(false)
    setSelectedDeal(null)
  }

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
      <div className="flex gap-4 overflow-x-auto pb-6 scroll-smooth">
        {STAGES.map(stage => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            deals={dealsByStage[stage.id] || []}
            isLoading={isLoading}
            onDealClick={handleDealClick}
          />
        ))}
      </div>

      <DragOverlay>
        {activeDeal ? <DealCard deal={activeDeal} isDragging /> : null}
      </DragOverlay>

      <DealDetailsModal
        deal={selectedDeal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDeal}
        onDelete={handleDeleteDeal}
      />
    </DndContext>
  )
}

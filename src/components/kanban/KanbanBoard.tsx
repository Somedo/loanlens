'use client'

import { useState, useEffect } from 'react'
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
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { KanbanColumn } from './KanbanColumn'
import { DealCard } from './DealCard'
import { CreateDealModal } from './CreateDealModal'
import { Button } from '@/components/ui/button'
import { Plus, RefreshCw } from 'lucide-react'

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

export function KanbanBoard() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Fetch deals from API
  const fetchDeals = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/deals')
      if (response.ok) {
        const data = await response.json()
        setDeals(data)
      }
    } catch (error) {
      console.error('Failed to fetch deals:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDeals()
  }, [])

  // Group deals by stage
  const dealsByStage = STAGES.reduce((acc, stage) => {
    acc[stage.id] = deals
      .filter((deal) => deal.stage === stage.id)
      .sort((a, b) => a.position - b.position)
    return acc
  }, {} as Record<DealStage, Deal[]>)

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    // No local state mutation here; handle saving on drag end only.
    if (!event.over) return
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeDeal = deals.find((d) => d.id === activeId)
    if (!activeDeal) return

    // Determine the target stage
    let targetStage = activeDeal.stage
    const overStage = STAGES.find((s) => s.id === overId)
    if (overStage) {
      targetStage = overStage.id
    } else {
      const overDeal = deals.find((d) => d.id === overId)
      if (overDeal) {
        targetStage = overDeal.stage
      }
    }

    console.log('Kanban drag end:', {
      activeId,
      overId,
      sourceStage: activeDeal.stage,
      targetStage,
    })

    const stageDeals = deals
      .filter((d) => d.stage === targetStage)
      .sort((a, b) => a.position - b.position)

    const oldIndex = stageDeals.findIndex((d) => d.id === activeId)
    const newIndex = stageDeals.findIndex((d) => d.id === overId)

    console.log('Kanban indices:', { oldIndex, newIndex, stageSize: stageDeals.length })

    if (activeDeal.stage !== targetStage || (newIndex >= 0 && oldIndex !== newIndex)) {
      const newPosition = oldIndex === -1 ? (newIndex >= 0 ? newIndex : stageDeals.length) : newIndex

      // Update local state optimistically
      setDeals((prevDeals) => {
        return prevDeals.map((deal) => {
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
      })

      try {
        const response = await fetch(`/api/deals/${activeId}/stage`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stage: targetStage,
            position: newPosition,
          }),
        })
        const responseBody = await response.text()
        console.log('Kanban save response:', response.status, responseBody)
        if (!response.ok) {
          console.error('Failed to save deal move:', response.statusText)
          fetchDeals()
        }
      } catch (error) {
        console.error('Failed to save deal move:', error)
        fetchDeals()
      }
    }
  }

  const activeDeal = activeId ? deals.find((d) => d.id === activeId) : null

  const handleDealCreated = () => {
    setShowCreateModal(false)
    fetchDeals()
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Deal Pipeline</h1>
          <p className="text-muted-foreground">
            Manage your bridging loan deals
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDeals}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Deal
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => (
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

      {/* Create Deal Modal */}
      {showCreateModal && (
        <CreateDealModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleDealCreated}
        />
      )}
    </div>
  )
}

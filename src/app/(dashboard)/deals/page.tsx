'use client'

import { useState, useEffect, useCallback } from 'react'
import { KanbanBoard, Deal } from '@/components/kanban/KanbanBoard'
import { DealsListView } from '@/components/kanban/DealsListView'
import { CreateDealModal } from '@/components/kanban/CreateDealModal'
import { Button } from '@/components/ui/button'
import { LayoutGrid, List, Plus, RefreshCw } from 'lucide-react'

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('dealsViewMode')
    if (saved === 'list' || saved === 'kanban') {
      setViewMode(saved)
    }
  }, [])

  const fetchDeals = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    fetchDeals()
  }, [fetchDeals])

  const handleViewChange = (mode: 'kanban' | 'list') => {
    setViewMode(mode)
    localStorage.setItem('dealsViewMode', mode)
  }

  const handleStageChange = async (dealId: string, newStage: string) => {
    setDeals(prev =>
      prev.map(d => d.id === dealId ? { ...d, stage: newStage as Deal['stage'] } : d)
    )
    try {
      const response = await fetch(`/api/deals/${dealId}/stage`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage, position: 0 }),
      })
      if (!response.ok) {
        console.error('Stage update failed:', response.statusText)
        fetchDeals()
      }
    } catch (error) {
      console.error('Stage update error:', error)
      fetchDeals()
    }
  }

  const handleDelete = async (dealId: string) => {
    setDeals(prev => prev.filter(d => d.id !== dealId))
    try {
      const response = await fetch(`/api/deals/${dealId}`, { method: 'DELETE' })
      if (!response.ok) {
        console.error('Delete failed:', response.statusText)
        fetchDeals()
      }
    } catch (error) {
      console.error('Delete error:', error)
      fetchDeals()
    }
  }

  const handleDealClick = (_deal: Deal) => {
    // TODO: open deal details/edit modal
  }

  return (
    <div className="container mx-auto py-6 h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold">Deal Pipeline</h1>
          <p className="text-muted-foreground">Manage your bridging loan deals</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-lg border overflow-hidden">
            <button
              onClick={() => handleViewChange('kanban')}
              className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => handleViewChange('list')}
              className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchDeals}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button size="sm" onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">New Deal</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-auto">
        {viewMode === 'kanban' ? (
          <div className="h-full flex flex-col">
            <KanbanBoard
              deals={deals}
              isLoading={isLoading}
              setDeals={setDeals}
              onRefetch={fetchDeals}
            />
          </div>
        ) : (
          <DealsListView
            deals={deals}
            onDealClick={handleDealClick}
            onStageChange={handleStageChange}
            onDelete={handleDelete}
          />
        )}
      </div>

      {showCreateModal && (
        <CreateDealModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false)
            fetchDeals()
          }}
        />
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Loader2, Trash2, Clock } from 'lucide-react'
import { Deal, DealStage, DealPriority } from './KanbanBoard'
import { format, formatDistanceToNow } from 'date-fns'

interface StageHistoryEntry {
  id: string
  old_stage: string | null
  new_stage: string
  changed_at: string
}

interface DealDetailsModalProps {
  deal: Deal | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedDeal: Deal) => Promise<void>
  onDelete: (dealId: string) => Promise<void>
}

const STAGE_LABELS: Record<string, string> = {
  lead: 'Lead',
  active: 'Active',
  completion: 'Completion',
  redeemed: 'Redeemed',
}

export function DealDetailsModal({
  deal,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: DealDetailsModalProps) {
  const [formData, setFormData] = useState<Deal | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [activeTab, setActiveTab] = useState('details')
  const [history, setHistory] = useState<StageHistoryEntry[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    if (deal) {
      setFormData({ ...deal })
      setHasChanges(false)
      setShowDeleteConfirm(false)
      setActiveTab('details')
      setHistory([])
    }
  }, [deal])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const fetchHistory = async () => {
    if (!deal) return
    setHistoryLoading(true)
    try {
      const res = await fetch(`/api/deals/${deal.id}/history`)
      if (res.ok) setHistory(await res.json())
    } catch {
      // silently ignore
    } finally {
      setHistoryLoading(false)
    }
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (tab === 'history') fetchHistory()
  }

  const updateField = <K extends keyof Deal>(field: K, value: Deal[K]) => {
    setFormData(prev => {
      if (!prev) return prev
      const updated = { ...prev, [field]: value }
      if (field === 'loan_amount' || field === 'property_value') {
        const loan = field === 'loan_amount' ? (value as number) : prev.loan_amount
        const prop = field === 'property_value' ? (value as number) : prev.property_value
        if (loan && prop) {
          updated.ltv_percentage = parseFloat(((loan / prop) * 100).toFixed(2))
        } else {
          updated.ltv_percentage = undefined
        }
      }
      return updated
    })
    setHasChanges(true)
  }

  const handleSave = async () => {
    if (!formData?.title?.trim()) {
      setToast({ type: 'error', message: 'Title is required' })
      return
    }
    setIsSaving(true)
    try {
      await onSave(formData)
      setHasChanges(false)
      setToast({ type: 'success', message: 'Deal saved successfully' })
    } catch {
      setToast({ type: 'error', message: 'Failed to save deal' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteConfirmed = async () => {
    if (!deal) return
    setIsDeleting(true)
    try {
      await onDelete(deal.id)
    } catch {
      setToast({ type: 'error', message: 'Failed to delete deal' })
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  if (!deal || !formData) return null

  const ltvDisplay = formData.ltv_percentage
    ? `${formData.ltv_percentage.toFixed(2)}%`
    : 'N/A'

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Deal Details: {deal.title}</DialogTitle>
          <Input
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            className="text-xl font-semibold border-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-auto bg-transparent"
            placeholder="Deal title..."
          />
        </DialogHeader>

        {toast && (
          <div className={`rounded-md px-4 py-2.5 text-sm font-medium ${
            toast.type === 'success'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
          }`}>
            {toast.message}
          </div>
        )}

        {showDeleteConfirm && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 space-y-3">
            <p className="text-sm font-medium">
              Delete &ldquo;{deal.title}&rdquo;? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteConfirmed}
                disabled={isDeleting}
              >
                {isDeleting && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
                Delete
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-6">
            {/* Stage & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="modal-stage">Stage</Label>
                <Select
                  value={formData.stage}
                  onValueChange={(v) => updateField('stage', v as DealStage)}
                >
                  <SelectTrigger id="modal-stage">
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

              <div className="space-y-1.5">
                <Label htmlFor="modal-priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(v) => updateField('priority', v as DealPriority)}
                >
                  <SelectTrigger id="modal-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="modal-description">Description</Label>
              <Textarea
                id="modal-description"
                value={formData.description ?? ''}
                onChange={(e) => updateField('description', e.target.value)}
                rows={3}
                placeholder="Deal description..."
              />
            </div>

            {/* Client Information */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Client Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <Label htmlFor="modal-client-name">Client Name</Label>
                  <Input
                    id="modal-client-name"
                    value={formData.client_name ?? ''}
                    onChange={(e) => updateField('client_name', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="modal-client-email">Email</Label>
                  <Input
                    id="modal-client-email"
                    type="email"
                    value={formData.client_email ?? ''}
                    onChange={(e) => updateField('client_email', e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="modal-client-phone">Phone</Label>
                  <Input
                    id="modal-client-phone"
                    type="tel"
                    value={formData.client_phone ?? ''}
                    onChange={(e) => updateField('client_phone', e.target.value)}
                    placeholder="+44 20 1234 5678"
                  />
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Financial Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="modal-loan-amount">Loan Amount (£)</Label>
                  <Input
                    id="modal-loan-amount"
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.loan_amount ?? ''}
                    onChange={(e) =>
                      updateField('loan_amount', e.target.value ? parseFloat(e.target.value) : undefined)
                    }
                    placeholder="250000"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="modal-property-value">Property Value (£)</Label>
                  <Input
                    id="modal-property-value"
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.property_value ?? ''}
                    onChange={(e) =>
                      updateField('property_value', e.target.value ? parseFloat(e.target.value) : undefined)
                    }
                    placeholder="350000"
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label>LTV (auto-calculated)</Label>
                  <Input
                    value={ltvDisplay}
                    readOnly
                    className="bg-muted/50 text-muted-foreground cursor-default"
                  />
                </div>
              </div>
            </div>

            {/* Created date */}
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                Created on {format(new Date(deal.created_at), 'MMMM d, yyyy')} at{' '}
                {format(new Date(deal.created_at), 'h:mm a')}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            {historyLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
                <Clock className="h-10 w-10 opacity-30" />
                <p className="text-sm">No stage history recorded yet</p>
              </div>
            ) : (
              <div className="relative pl-8">
                <div className="absolute left-3 top-1 bottom-1 w-px bg-border" />
                <div className="space-y-5">
                  {history.map((entry) => (
                    <div key={entry.id} className="relative">
                      <div className="absolute -left-5 top-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-background" />
                      <p className="text-sm font-medium leading-snug">
                        {entry.old_stage
                          ? `Moved from ${STAGE_LABELS[entry.old_stage] ?? entry.old_stage} to ${STAGE_LABELS[entry.new_stage] ?? entry.new_stage}`
                          : `Created in ${STAGE_LABELS[entry.new_stage] ?? entry.new_stage}`}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {format(new Date(entry.changed_at), 'MMM d, yyyy')} at{' '}
                        {format(new Date(entry.changed_at), 'h:mm a')}
                        {' · '}
                        {formatDistanceToNow(new Date(entry.changed_at), { addSuffix: true })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t mt-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isSaving || isDeleting || showDeleteConfirm}
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            Delete Deal
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSaving || isDeleting}
            >
              {hasChanges ? 'Discard' : 'Close'}
            </Button>
            {hasChanges && (
              <Button onClick={handleSave} disabled={isSaving || isDeleting}>
                {isSaving && <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />}
                Save Changes
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

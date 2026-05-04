'use client'

import { useState } from 'react'
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
import { Loader2 } from 'lucide-react'
import { DealStage, DealPriority } from './KanbanBoard'

interface CreateDealModalProps {
  onClose: () => void
  onCreated: () => void
}

export function CreateDealModal({ onClose, onCreated }: CreateDealModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stage: 'lead' as DealStage,
    priority: 'medium' as DealPriority,
    loan_amount: '',
    property_value: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    property_address: '',
    property_postcode: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          loan_amount: formData.loan_amount ? parseFloat(formData.loan_amount) : null,
          property_value: formData.property_value ? parseFloat(formData.property_value) : null,
          ltv_percentage:
            formData.loan_amount && formData.property_value
              ? (parseFloat(formData.loan_amount) / parseFloat(formData.property_value)) * 100
              : null,
        }),
      })

      if (response.ok) {
        onCreated()
      } else {
        const error = await response.json()
        alert(`Failed to create deal: ${error.message}`)
      }
    } catch (error) {
      console.error('Failed to create deal:', error)
      alert('Failed to create deal')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Deal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">Deal Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., 123 Main St Bridging Loan"
                  required
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the deal..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="stage">Stage</Label>
                <Select
                  value={formData.stage}
                  onValueChange={(value: DealStage) => setFormData({ ...formData, stage: value })}
                >
                  <SelectTrigger>
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

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: DealPriority) =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
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
          </div>

          {/* Financial Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Financial Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="loan_amount">Loan Amount (£)</Label>
                <Input
                  id="loan_amount"
                  type="number"
                  step="0.01"
                  value={formData.loan_amount}
                  onChange={(e) => setFormData({ ...formData, loan_amount: e.target.value })}
                  placeholder="250000"
                />
              </div>

              <div>
                <Label htmlFor="property_value">Property Value (£)</Label>
                <Input
                  id="property_value"
                  type="number"
                  step="0.01"
                  value={formData.property_value}
                  onChange={(e) => setFormData({ ...formData, property_value: e.target.value })}
                  placeholder="350000"
                />
              </div>
            </div>

            {formData.loan_amount && formData.property_value && (
              <p className="text-sm text-muted-foreground">
                LTV:{' '}
                {((parseFloat(formData.loan_amount) / parseFloat(formData.property_value)) * 100).toFixed(2)}%
              </p>
            )}
          </div>

          {/* Client Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Client Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="client_name">Client Name</Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label htmlFor="client_email">Email</Label>
                <Input
                  id="client_email"
                  type="email"
                  value={formData.client_email}
                  onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <Label htmlFor="client_phone">Phone</Label>
                <Input
                  id="client_phone"
                  type="tel"
                  value={formData.client_phone}
                  onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                  placeholder="+44 20 1234 5678"
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Property Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="property_address">Property Address</Label>
                <Input
                  id="property_address"
                  value={formData.property_address}
                  onChange={(e) => setFormData({ ...formData, property_address: e.target.value })}
                  placeholder="123 Main Street, London"
                />
              </div>

              <div>
                <Label htmlFor="property_postcode">Postcode</Label>
                <Input
                  id="property_postcode"
                  value={formData.property_postcode}
                  onChange={(e) => setFormData({ ...formData, property_postcode: e.target.value })}
                  placeholder="SW1A 1AA"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Deal'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

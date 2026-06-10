'use client'

import { LucideIcon } from 'lucide-react'

type RailColor = 'primary' | 'active' | 'completion' | 'redeemed' | 'default'

const RAIL_VAR: Record<RailColor, string> = {
  primary: 'var(--rail)',
  active: 'var(--status-active)',
  completion: 'var(--status-completion)',
  redeemed: 'var(--status-redeemed)',
  default: 'var(--status-default)',
}

interface StatCardProps {
  label: string
  value: string
  caption?: string
  captionMuted?: boolean
  icon: LucideIcon
  rail?: RailColor
}

export default function StatCard({
  label,
  value,
  caption,
  captionMuted = false,
  icon: Icon,
  rail = 'primary',
}: StatCardProps) {
  return (
    <div className="lens-card relative overflow-hidden p-5 pb-[18px]">
      {/* status rail */}
      <span
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ background: RAIL_VAR[rail] }}
      />

      <div className="flex items-center gap-2 mb-[15px]">
        <Icon className="w-[14px] h-[14px] text-muted-foreground" strokeWidth={1.7} />
        <span className="text-xs font-medium text-muted-foreground tracking-[0.01em]">
          {label}
        </span>
      </div>

      <div
        className="font-mono font-semibold text-[27px] leading-none tracking-[-0.02em]"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {value}
      </div>

      {caption && (
        <div
          className={`text-xs mt-[9px] font-medium ${
            captionMuted ? 'text-muted-foreground font-normal' : ''
          }`}
          style={captionMuted ? undefined : { color: 'var(--primary)' }}
        >
          {caption}
        </div>
      )}
    </div>
  )
}

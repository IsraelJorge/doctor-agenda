'use client'

import { Button } from '@/components/ui/button'

import { Icon, IconProps } from './icon'

interface EmptyAlertProps {
  iconName?: IconProps['name']
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyAlert({
  iconName,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyAlertProps) {
  return (
    <div
      className={`bg-muted/30 flex items-center gap-3 rounded-lg border border-dashed p-4 ${className}`}
    >
      {iconName && (
        <div className="flex-shrink-0">
          <Icon name={iconName} className="text-muted-foreground h-5 w-5" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-foreground text-sm font-medium">{title}</p>
        {description && (
          <p className="text-muted-foreground mt-1 text-xs">{description}</p>
        )}
      </div>
      {actionLabel && onAction && (
        <Button
          size="sm"
          variant="outline"
          onClick={onAction}
          className="flex-shrink-0"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

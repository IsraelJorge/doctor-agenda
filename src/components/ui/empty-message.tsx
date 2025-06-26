'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import { Icon, IconProps } from './icon'

interface EmptyMessageProps {
  iconName?: IconProps['name']
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyMessage({
  iconName,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyMessageProps) {
  return (
    <Card className={`border-dashed ${className}`}>
      <CardContent className="flex flex-col items-center justify-center px-6 py-12 text-center">
        {iconName && (
          <div className="bg-muted mb-4 rounded-full p-4">
            <Icon name={iconName} className="text-muted-foreground h-8 w-8" />
          </div>
        )}
        <h3 className="text-foreground mb-2 text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-muted-foreground mb-6 max-w-sm text-sm">
            {description}
          </p>
        )}
        {actionLabel && onAction && (
          <Button onClick={onAction} className="mt-2">
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

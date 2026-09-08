import * as React from 'react';
import { cn, getInitials } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'busy' | 'away' | 'dnd' | 'offline';
}

export function Avatar({ src, name, size = 'md', status, className, ...props }: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  const sizeClasses = {
    sm: 'h-6 w-6 text-[10px]',
    md: 'h-8 w-8 text-xs',
    lg: 'h-10 w-10 text-sm',
  };

  const statusColors = {
    online: 'bg-emerald-500',
    busy: 'bg-rose-500',
    away: 'bg-amber-500',
    dnd: 'bg-rose-600',
    offline: 'bg-zinc-400',
  };

  return (
    <div className={cn('relative inline-block flex-shrink-0', className)} {...props}>
      <div
        className={cn(
          'relative flex items-center justify-center overflow-hidden rounded-full bg-muted font-medium text-muted-foreground border border-border/40',
          sizeClasses[size]
        )}
      >
        {src && !imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={name}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-background',
            statusColors[status],
            size === 'sm' ? 'h-1.5 w-1.5' : 'h-2.5 w-2.5'
          )}
        />
      )}
    </div>
  );
}

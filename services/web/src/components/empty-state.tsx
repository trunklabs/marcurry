import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function EmptyState({ icon: Icon, title, description, action, className, size = 'md' }: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      container: 'min-h-[200px] p-6',
      icon: 'h-8 w-8 mb-3',
      title: 'text-base',
      description: 'text-xs',
    },
    md: {
      container: 'min-h-[300px] p-8',
      icon: 'h-12 w-12 mb-4',
      title: 'text-xl',
      description: 'text-sm',
    },
    lg: {
      container: 'min-h-[400px] p-12',
      icon: 'h-16 w-16 mb-6',
      title: 'text-2xl',
      description: 'text-base',
    },
  };

  const sizes = sizeClasses[size];

  return (
    <div
      className={cn(
        'border-muted-foreground/25 flex flex-col items-center justify-center rounded-lg border-2 border-dashed text-center',
        sizes.container,
        className
      )}
    >
      <Icon className={cn('text-muted-foreground/50', sizes.icon)} />
      <h2 className={cn('font-semibold', sizes.title)}>{title}</h2>
      {description && <p className={cn('text-muted-foreground mt-2 max-w-md', sizes.description)}>{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

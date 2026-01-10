'use client';

import { Key } from 'lucide-react';
import { CopyButton } from '@/components/copy-button';
import { cn } from '@/lib/utils';

interface KeyDisplayProps {
  value: string;
  className?: string;
  size?: 'sm' | 'md';
}

/**
 * Displays a key value with an icon and copy button.
 * Provides consistent styling and interaction across the application.
 */
export function KeyDisplay({ value, className, size = 'sm' }: KeyDisplayProps) {
  const sizeClasses = {
    sm: {
      container: 'gap-1.5 text-xs',
      icon: 'h-3 w-3',
      button: 'h-4 w-4',
    },
    md: {
      container: 'gap-2 text-sm',
      icon: 'h-3.5 w-3.5',
      button: 'h-5 w-5',
    },
  };

  const sizes = sizeClasses[size];

  return (
    <div className={cn('text-muted-foreground inline-flex items-center', sizes.container, className)}>
      <Key className={cn('flex-shrink-0', sizes.icon)} />
      <code className="font-mono">{value}</code>
      <CopyButton text={value} className={sizes.button} />
    </div>
  );
}

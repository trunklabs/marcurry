'use client';

import { Button } from '@/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <Button variant="ghost" size="icon" className={className} onClick={copyToClipboard}>
      <Copy className="h-3 w-3" />
    </Button>
  );
}

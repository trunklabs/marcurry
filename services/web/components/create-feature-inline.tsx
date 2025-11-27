'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, Sparkles } from 'lucide-react';
import { GatesEditor } from '@/components/gates-editor';
import { createFeature } from '@/app/actions/featureActions';
import { useToast } from '@/components/ui/toast';

export function CreateFeatureInline(props: { productId?: string; envId?: string }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const { showToast } = useToast();

  async function action(formData: FormData) {
    setSubmitting(true);
    try {
      await createFeature(formData);
      setOpen(false);
      showToast('Feature created successfully');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-1 h-4 w-4" />
          New Feature
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form action={action} className="space-y-4">
          {props.productId ? <input type="hidden" name="productId" value={props.productId} /> : null}
          {props.envId ? <input type="hidden" name="envId" value={props.envId} /> : null}
          <DialogHeader>
            <DialogTitle>Create Feature</DialogTitle>
            <DialogDescription>Create a new feature flag</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Input id="label" name="label" placeholder="My Feature" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="Optional description" />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="enabled">Enabled</Label>
            <Switch id="enabled" name="enabled" checked={enabled} onCheckedChange={setEnabled} />
          </div>

          {enabled && <GatesEditor initialGates={[]} />}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={submitting}>
              <X className="mr-1 h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              <Sparkles className="mr-1 h-4 w-4" />
              {submitting ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

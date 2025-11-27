'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Save, Trash2 } from 'lucide-react';
import { GatesEditor } from '@/components/gates-editor';
import { deleteFeature, updateFeature } from '@/app/actions/featureActions';
import { useToast } from '@/components/ui/toast';
import type { FeatureFlag } from '@/lib/db/types';
import { useRouter } from 'next/navigation';
import { tryCatch } from '@/lib/utils';

export function EditFeatureForm({ feature }: { feature: FeatureFlag }) {
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [enabled, setEnabled] = useState(feature.enabled);
  const { showToast } = useToast();
  const backUrl = `/products/${feature.productId}/environments/${feature.envId}`;

  async function handleUpdate(formData: FormData) {
    setSubmitting(true);
    const [error] = await tryCatch(updateFeature(formData));
    setSubmitting(false);
    router.push(backUrl);

    if (error) {
      showToast('Error updating feature flag', 'error');
      return;
    }

    showToast('Feature flag updated successfully');
  }

  async function handleDelete() {
    setDeleting(true);
    const [error] = await tryCatch(deleteFeature(feature.id));
    setDeleting(false);
    router.push(backUrl);

    if (error) {
      showToast('Error deleting feature flag', 'error');
      return;
    }

    showToast('Feature flag deleted successfully');
  }

  return (
    <div className="max-w-xl space-y-4">
      <form id="edit-feature-form" action={handleUpdate} className="space-y-4">
        <input type="hidden" name="id" value={feature.id} />

        <div className="space-y-2">
          <Label htmlFor="label">Label</Label>
          <Input id="label" name="label" defaultValue={feature.label} required disabled />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" defaultValue={feature.description ?? ''} />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="enabled">Enabled</Label>
          <Switch id="enabled" name="enabled" checked={enabled} onCheckedChange={setEnabled} />
        </div>

        {enabled && <GatesEditor initialGates={feature.gates || []} />}
      </form>
      <div className="flex justify-end gap-2">
        <form action={handleDelete}>
          <Button type="submit" variant="destructive" disabled={deleting}>
            <Trash2 className="mr-1 h-4 w-4" />
            {deleting ? 'Deleting...' : 'Delete Feature'}
          </Button>
        </form>

        <Button type="submit" form="edit-feature-form" disabled={submitting}>
          <Save className="mr-1 h-4 w-4" />
          {submitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
}

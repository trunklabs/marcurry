'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/dialog';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { useToast } from '@/ui/toast';
import { updateProjectAction } from '@/server/projects';
import {
  createEnvironmentAction,
  deleteEnvironmentAction,
  updateEnvironmentAction,
  listEnvironmentsAction,
} from '@/server/environments';
import { slugify } from '@/lib/utils';
import type { Project, Environment } from '@marcurry/core';

export function EditProductDialog({ product }: { product: Project }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [envs, setEnvs] = useState<Environment[] | null>(null);
  const [loadingEnvs, setLoadingEnvs] = useState(false);
  const { showToast } = useToast();

  // State for new environment form with auto-slugify
  const [newEnvName, setNewEnvName] = useState('');
  const [newEnvKey, setNewEnvKey] = useState('');

  const handleNewEnvNameChange = (name: string) => {
    setNewEnvName(name);
    // Auto-slugify key from name if key is empty or matches old slugified name
    if (newEnvKey === '' || newEnvKey === slugify(newEnvName)) {
      setNewEnvKey(slugify(name));
    }
  };

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    async function loadEnvs() {
      setLoadingEnvs(true);
      try {
        const data = await listEnvironmentsAction(product.id);
        if (!cancelled) setEnvs(data);
      } catch (_e) {
        console.log(_e);
        showToast('Failed to load environments', 'error');
      } finally {
        if (!cancelled) setLoadingEnvs(false);
      }
    }
    loadEnvs();
    return () => {
      cancelled = true;
    };
  }, [open, product.id, showToast]);

  async function saveProduct(formData: FormData) {
    setSaving(true);
    try {
      const id = String(formData.get('id') || '');
      const name = String(formData.get('name') || '').trim();
      await updateProjectAction(id, { name });
      showToast('Project updated');
    } finally {
      setSaving(false);
    }
  }

  async function addEnv(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const name = newEnvName.trim();
      const key = newEnvKey.trim();
      if (name && key) {
        await createEnvironmentAction({ projectId: product.id, name, key });
        // refresh envs
        const data = await listEnvironmentsAction(product.id);
        setEnvs(data);
        // Reset form
        setNewEnvName('');
        setNewEnvKey('');
        showToast('Environment added');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add environment';
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function updateEnv(ev: FormData) {
    setSaving(true);
    try {
      const id = String(ev.get('id') || '');
      const name = String(ev.get('name') || '').trim();
      const key = String(ev.get('key') || '').trim();
      const updates: { name?: string; key?: string } = {};
      if (name) updates.name = name;
      if (key) updates.key = key;
      await updateEnvironmentAction(id, product.id, updates);
      const data = await listEnvironmentsAction(product.id);
      setEnvs(data);
      showToast('Environment updated');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update environment';
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function removeEnv(id: string) {
    setSaving(true);
    try {
      await deleteEnvironmentAction(id, product.id);
      const data = await listEnvironmentsAction(product.id);
      setEnvs(data);
      showToast('Environment removed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Pencil className="mr-1 h-4 w-4" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Update project info and manage environments</DialogDescription>
        </DialogHeader>

        {/* Product info */}
        <form action={saveProduct} className="space-y-3">
          <input type="hidden" name="id" value={product.id} />
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={product.name} />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>

        {/* Environments manager */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Environments</div>
              <div className="text-muted-foreground text-xs">Add or edit environments for this project</div>
            </div>
          </div>

          {/* Add environment */}
          <form onSubmit={addEnv} className="grid gap-3 rounded border p-3 md:grid-cols-[1fr_1fr_auto]">
            <div className="space-y-2">
              <Label htmlFor="new-env-name">Name</Label>
              <Input
                id="new-env-name"
                placeholder="Production"
                value={newEnvName}
                onChange={(e) => handleNewEnvNameChange(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-env-key">Key</Label>
              <Input
                id="new-env-key"
                placeholder="production"
                value={newEnvKey}
                onChange={(e) => setNewEnvKey(e.target.value)}
                required
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={saving || !newEnvName.trim() || !newEnvKey.trim()}>
                <Plus className="mr-2 h-4 w-4" /> Add
              </Button>
            </div>
          </form>

          {/* Existing envs */}
          <div className="space-y-2">
            {loadingEnvs && <div className="text-muted-foreground text-sm">Loading environments…</div>}
            {!loadingEnvs && (envs?.length ?? 0) === 0 && (
              <div className="text-muted-foreground text-sm">No environments yet.</div>
            )}
            {envs?.map((e) => {
              const isLastEnv = (envs?.length ?? 0) <= 1;
              return (
                <form
                  key={e.id}
                  action={updateEnv}
                  className="grid gap-3 rounded border p-3 md:grid-cols-[1fr_1fr_auto]"
                >
                  <input type="hidden" name="id" value={e.id} />
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input name="name" defaultValue={e.name} />
                  </div>
                  <div className="space-y-2">
                    <Label>Key</Label>
                    <Input name="key" defaultValue={e.key} />
                  </div>
                  <div className="flex items-end gap-2">
                    <Button type="submit" variant="outline" disabled={saving}>
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      disabled={saving || isLastEnv}
                      onClick={() => removeEnv(e.id)}
                      title={isLastEnv ? 'Cannot delete the last environment' : 'Delete environment'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              );
            })}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
            <X className="mr-1 h-4 w-4" /> Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

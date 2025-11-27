'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, Trash2 } from 'lucide-react';
import { deleteProductAction, updateProductAction } from '@/app/actions/productActions';
import { useToast } from '@/components/ui/toast';
import type { Product } from '@/lib/db/types';
import { tryCatch } from '@/lib/utils';

export function EditProductForm({ product }: { product: Product }) {
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  async function handleUpdate(formData: FormData) {
    setSubmitting(true);
    const [error] = await tryCatch(updateProductAction(formData));
    setSubmitting(false);

    if (error) {
      showToast('Error updating product', 'error');
      return;
    }

    showToast('Product updated successfully');
  }

  async function handleDelete() {
    setDeleting(true);
    const [error] = await tryCatch(deleteProductAction(product.id));
    setDeleting(false);

    if (error) {
      showToast('Error deleting product', 'error');
      return;
    }

    showToast('Product deleted successfully');
  }

  return (
    <>
      <form action={handleUpdate} className="max-w-xl space-y-4">
        <input type="hidden" name="id" value={product.id} />
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={product.name} required disabled />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" defaultValue={product.description ?? ''} />
        </div>
        <Button type="submit" disabled={submitting}>
          <Save className="mr-1 h-4 w-4" />
          {submitting ? 'Saving...' : 'Save'}
        </Button>
      </form>
      <div className="mt-4">
        <form action={handleDelete}>
          <Button type="submit" variant="destructive" disabled={deleting}>
            <Trash2 className="mr-1 h-4 w-4" />
            {deleting ? 'Deleting...' : 'Delete Product'}
          </Button>
        </form>
      </div>
    </>
  );
}

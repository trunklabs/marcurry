import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ExternalLink, Trash2 } from 'lucide-react';
import Link from 'next/link';
import type { Product } from '@/lib/db/types';
import { deleteProductAction } from '@/app/actions/productActions';

export interface ProductRow {
  product: Product;
  envCount: number;
  featureCount: number;
}

export function ProductsTable({
  items,
  actions,
}: {
  items: ProductRow[];
  actions?: (p: ProductRow) => React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>List of products and their usage</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">No products yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Environments</TableHead>
                <TableHead>Features</TableHead>
                <TableHead className="w-[1%]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((row) => (
                <TableRow key={row.product.id}>
                  <TableCell className="font-medium">{row.product.name}</TableCell>
                  <TableCell>{row.envCount}</TableCell>
                  <TableCell>{row.featureCount}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/products/${row.product.id}`}>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="mr-1 h-4 w-4" />
                          Open
                        </Button>
                      </Link>
                      {actions ? actions(row) : null}
                      <form
                        action={async () => {
                          'use server';
                          await deleteProductAction(row.product.id);
                        }}
                      >
                        <Button size="sm" variant="destructive" type="submit">
                          <Trash2 className="mr-1 h-4 w-4" />
                          Delete
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

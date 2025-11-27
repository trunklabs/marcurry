import { listProducts, listEnvironments, listFeatureFlags } from '@/lib/apiHandlers';
import { ProductsTable, type ProductRow } from '@/components/products-table';
import { CreateProductInline } from '@/components/create-product-inline';

export default async function ProductsPage() {
  const products = await listProducts();

  const rows: ProductRow[] = await Promise.all(
    products.map(async (product) => {
      const [envs, feats] = await Promise.all([
        listEnvironments({ productId: product.id }),
        listFeatureFlags({ productId: product.id }),
      ]);
      return {
        product,
        envCount: envs.length,
        featureCount: feats.length,
      } satisfies ProductRow;
    })
  );

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-muted-foreground mt-1">Manage your products</p>
        </div>
        <CreateProductInline />
      </div>

      <ProductsTable items={rows} />
    </div>
  );
}

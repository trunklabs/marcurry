import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FeaturesTable } from '@/components/feature-usage-table';
import { CreateFeatureInline } from '@/components/create-feature-inline';
import { EditEnvironmentForm } from '@/components/edit-environment-form';
import { getProductById } from '@/lib/apiHandlers/products';
import { getEnvironmentById } from '@/lib/apiHandlers/environments';
import { listFeatureFlags } from '@/lib/apiHandlers/flags';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export default async function EnvironmentDetailPage({
  params,
}: {
  params: Promise<{ productId: string; envId: string }>;
}) {
  const { productId, envId } = await params;
  const [product, environment] = await Promise.all([getProductById(productId), getEnvironmentById(envId)]);
  if (!product || !environment || environment.productId !== product.id) return notFound();

  const features = await listFeatureFlags({ productId, envId });

  return (
    <div className="container mx-auto py-8">
      <Breadcrumbs
        items={[
          { label: 'Products', href: '/products', type: 'home' },
          { label: product.name, href: `/products/${product.id}`, type: 'product' },
          { label: environment.name, type: 'environment' },
        ]}
      />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Environment</h1>
          <p className="text-muted-foreground mt-1">Manage features in this environment</p>
        </div>
        <CreateFeatureInline productId={productId} envId={envId} />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Edit Environment</CardTitle>
        </CardHeader>
        <CardContent>
          <EditEnvironmentForm environment={environment} />
        </CardContent>
      </Card>

      <FeaturesTable features={features} allowDelete={true} />
    </div>
  );
}

import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EditFeatureForm } from '@/components/edit-feature-form';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { getProductById } from '@/lib/apiHandlers/products';
import { getEnvironmentById } from '@/lib/apiHandlers/environments';
import { getFeatureFlagById } from '@/lib/apiHandlers/flags';

export default async function FeatureDetailPage({ params }: { params: Promise<{ featureId: string }> }) {
  const { featureId } = await params;
  const feature = await getFeatureFlagById(featureId);
  if (!feature) return notFound();

  const [product, environment] = await Promise.all([
    getProductById(feature.productId),
    getEnvironmentById(feature.envId),
  ]);

  if (!product || !environment) return notFound();

  return (
    <div className="container mx-auto py-8">
      <Breadcrumbs
        items={[
          { label: 'Products', href: '/products', type: 'home' },
          { label: product.name, href: `/products/${product.id}`, type: 'product' },
          {
            label: environment.name,
            href: `/products/${product.id}/environments/${environment.id}`,
            type: 'environment',
          },
          { label: feature.label, type: 'feature' },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Feature</h1>
        <p className="text-muted-foreground mt-1">Edit feature flag settings</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Edit Feature</CardTitle>
        </CardHeader>
        <CardContent>
          <EditFeatureForm feature={feature} />
        </CardContent>
      </Card>
    </div>
  );
}

export default async function FeaturePage({ params }: { params: Promise<{ feature: string }> }) {
  const { feature } = await params;

  return <div>{feature}</div>;
}

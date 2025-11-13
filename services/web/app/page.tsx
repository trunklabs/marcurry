import { StatsCard } from '@/components/stats-card';
import { Flag } from 'lucide-react';
import { FeatureUsageTable } from '@/components/feature-usage-table';

const features = [];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your feature flag management</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        <div className="md:sticky md:top-24 md:self-start">
          <StatsCard title="Total Features" value={features.length} icon={Flag} />
        </div>

        <div className="min-w-0">
          <FeatureUsageTable />
        </div>
      </div>
    </div>
  );
}

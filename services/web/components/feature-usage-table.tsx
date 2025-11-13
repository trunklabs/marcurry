'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

type ID = string;

type Gate = GateAll | GateActors | GateGroups;

interface GateAll {
  type: 'all';
  enabled: boolean;
}

interface GateActors {
  type: 'users';
  actorIds: string[];
}

interface GateGroups {
  type: 'groups';
  groupIds: string[];
}

interface FeatureFlag {
  id: ID;
  name: string;
  enabled: boolean;
  productId: ID;
  envId: ID;
  key: string;
  description?: string;
  gates: Gate[];
  createdAt: string;
}

const features: FeatureFlag[] = [
  {
    id: '1',
    name: 'Feature 1',
    enabled: true,
    productId: '1',
    envId: '1',
    key: 'feature_a',
    gates: [{ type: 'all', enabled: true }],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Feature 2',
    enabled: false,
    productId: '1',
    envId: '1',
    key: 'feature_b',
    gates: [{ type: 'all', enabled: false }],
    createdAt: '2024-01-02T00:00:00Z',
  },
];

export function FeatureUsageTable() {
  const router = useRouter();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Usage</CardTitle>
        <CardDescription>Check statistics for all feature flags</CardDescription>
      </CardHeader>
      <CardContent>
        {features.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">No usage data available yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((feature) => (
                <TableRow
                  key={feature.id}
                  tabIndex={0}
                  role="link"
                  aria-label={`Open ${feature.name}`}
                  className="cursor-pointer transition-colors hover:bg-muted focus:bg-muted"
                  onClick={() => router.push(`/features/${feature.key}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      router.push(`/features/${feature.key}`);
                    }
                  }}
                >
                  <TableCell className="font-medium">{feature.name}</TableCell>
                  <TableCell>
                    <Badge variant={feature.enabled ? 'default' : 'secondary'}>{feature.enabled ? 'On' : 'Off'}</Badge>
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

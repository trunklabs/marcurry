'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import type { Project } from '@marcurry/core';

interface FlagsFiltersProps {
  projects: Project[];
  currentProject?: string;
  currentSearch?: string;
}

export function FlagsFilters({ projects, currentProject, currentSearch }: FlagsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleProjectChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'all') {
      params.delete('project');
    } else {
      params.set('project', value);
    }
    router.push(`/app/flags?${params.toString()}`);
  };

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('q', value);
    } else {
      params.delete('q');
    }
    router.push(`/app/flags?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-4">
      <Select value={currentProject || 'all'} onValueChange={handleProjectChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="All Projects" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex-1">
        <Input
          placeholder="Search flags..."
          value={currentSearch || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>
    </div>
  );
}

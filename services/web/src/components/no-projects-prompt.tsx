import { Folder } from 'lucide-react';
import { EmptyState } from '@/components/empty-state';
import { CreateProjectInline } from '@/components/create-project-inline';

interface NoProjectsPromptProps {
  size?: 'sm' | 'md' | 'lg';
  context?: 'dashboard' | 'projects' | 'flags';
}

export function NoProjectsPrompt({ size = 'lg', context = 'dashboard' }: NoProjectsPromptProps) {
  const messages = {
    dashboard: {
      title: 'Welcome to Feature Flags',
      description:
        'Get started by creating your first project. Projects help you organize your feature flags and environments.',
    },
    projects: {
      title: 'No Projects Yet',
      description:
        'Projects help you organize your feature flags and environments. Create your first project to get started.',
    },
    flags: {
      title: 'No Projects Yet',
      description: 'You need to create a project before you can manage feature flags. Get started by creating one now.',
    },
  };

  const message = messages[context];

  return (
    <EmptyState
      icon={Folder}
      title={message.title}
      description={message.description}
      action={<CreateProjectInline />}
      size={size}
    />
  );
}

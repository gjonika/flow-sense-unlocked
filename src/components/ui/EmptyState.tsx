
import React from 'react';
import { LucideIcon, FolderOpen } from 'lucide-react';
import { Button } from './button';
import { Icon } from './Icon';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = FolderOpen,
  actionLabel,
  onAction,
  className
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 text-center bg-bg-lighter rounded-lg border border-gray-light/50 animate-fade-in",
      className
    )}>
      <Icon 
        icon={icon} 
        size={48} 
        className="mb-4 text-gray-400" 
      />
      <h3 className="text-section-title text-gray-text mb-2">{title}</h3>
      <p className="text-body-sm text-muted-foreground mb-6 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          className="bg-brand-primary hover:bg-green-700 transition-colors duration-300"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

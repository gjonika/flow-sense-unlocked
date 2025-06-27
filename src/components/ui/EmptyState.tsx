
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  className = ""
}) => {
  return (
    <div className={`empty-state animate-smooth-fade-in ${className}`}>
      {Icon && (
        <div className="empty-state-icon">
          <Icon className="h-12 w-12" />
        </div>
      )}
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {actionLabel && onAction && (
        <Button 
          onClick={onAction} 
          className="bg-primary hover:bg-primary/90 text-primary-foreground hover-lift"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

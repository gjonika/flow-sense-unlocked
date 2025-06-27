
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type TagVariant = 'default' | 'status' | 'type';

interface TagBadgeProps {
  tag: string;
  variant?: TagVariant;
  className?: string;
  icon?: React.ReactNode;
}

const TagBadge: React.FC<TagBadgeProps> = ({ 
  tag, 
  variant = 'default',
  className,
  icon
}) => {
  // Get appropriate styles based on variant
  const getStyles = () => {
    switch (variant) {
      case 'status':
        return getStatusStyles(tag);
      case 'type':
        return getTypeStyles(tag);
      default:
        return 'bg-baltic-sand/50 hover:bg-baltic-sand/70 text-baltic-deep';
    }
  };
  
  return (
    <Badge 
      variant="outline"
      className={cn(
        "flex items-center text-xs font-medium py-0.5 px-2 rounded-full",
        getStyles(),
        className
      )}
    >
      {icon}
      {tag}
    </Badge>
  );
};

// Style helpers
function getStatusStyles(status: string): string {
  const statusStyles: Record<string, string> = {
    'Idea': 'bg-blue-100 text-blue-800 border-blue-200',
    'Planning': 'bg-purple-100 text-purple-800 border-purple-200',
    'In Progress': 'bg-amber-100 text-amber-800 border-amber-200',
    'Build': 'bg-orange-100 text-orange-800 border-orange-200',
    'Launch': 'bg-green-100 text-green-800 border-green-200',
    'Completed': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Abandoned': 'bg-slate-100 text-slate-800 border-slate-200'
  };
  
  return statusStyles[status] || 'bg-gray-100 text-gray-800 border-gray-200';
}

function getTypeStyles(type: string): string {
  const typeStyles: Record<string, string> = {
    'Personal': 'bg-violet-100 text-violet-800 border-violet-200',
    'Professional': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Education': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    'Market': 'bg-teal-100 text-teal-800 border-teal-200',
    'For Sale': 'bg-green-100 text-green-800 border-green-200',
    'Open Source': 'bg-amber-100 text-amber-800 border-amber-200',
    'Other': 'bg-slate-100 text-slate-800 border-slate-200'
  };
  
  return typeStyles[type] || 'bg-gray-100 text-gray-800 border-gray-200';
}

export default TagBadge;

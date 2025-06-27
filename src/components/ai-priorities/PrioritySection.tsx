
import React from 'react';
import { AIInsightItem } from './AIInsightItem';

interface PrioritySectionProps {
  title: string;
  icon: string;
  description: string;
  items: AIInsightItem[];
  itemType: 'priority' | 'neglected';
  onSelectProject?: (projectId: string) => void;
}

const PrioritySection: React.FC<PrioritySectionProps> = ({ 
  title, 
  icon, 
  description,
  items, 
  itemType,
  onSelectProject
}) => {
  // Dynamically import AIInsightItem to avoid circular dependencies
  const AIInsightItem = React.lazy(() => import('./AIInsightItem'));
  
  return (
    <div>
      <h3 className="font-medium mb-2 text-sm flex items-center">
        <span className="mr-1">{icon}</span> {title}
      </h3>
      <div className="space-y-2">
        {items.length > 0 ? (
          items.map((item, index) => (
            <React.Suspense key={index} fallback={<div className="p-3 bg-muted/50 rounded-md">Loading...</div>}>
              <AIInsightItem 
                item={item} 
                type={itemType} 
                onSelectProject={onSelectProject} 
              />
            </React.Suspense>
          ))
        ) : (
          <div className="text-sm text-muted-foreground">{description}</div>
        )}
      </div>
    </div>
  );
};

export default PrioritySection;


import React from 'react';

export interface AIInsightItem {
  name: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  projectId?: string;
}

interface AIInsightItemProps {
  item: AIInsightItem;
  type: 'priority' | 'neglected';
  onSelectProject?: (projectId: string) => void;
}

const AIInsightItem: React.FC<AIInsightItemProps> = ({ item, type, onSelectProject }) => {
  // Function to get priority badge
  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-medium">🔥 Urgent</span>;
      case 'medium':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">⭐ High Potential</span>;
      case 'low':
      default:
        return <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium">ℹ️ Normal</span>;
    }
  };

  const handleClick = () => {
    if (onSelectProject && item.projectId) {
      onSelectProject(item.projectId);
    }
  };

  return (
    <div 
      className="p-3 bg-muted/50 rounded-md transition-all hover:shadow-md border border-transparent hover:border-olive/20 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex justify-between items-center">
        <span className="font-medium text-sm">{item.name}</span>
        {type === 'priority' 
          ? getPriorityBadge(item.priority)
          : <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-medium">
              ⚠️ Neglected
            </span>
        }
      </div>
      <p className="text-xs text-muted-foreground mt-1">{item.reason}</p>
    </div>
  );
};

export default AIInsightItem;

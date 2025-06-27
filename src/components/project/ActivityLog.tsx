
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon, ChevronUpIcon, PlusIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ActivityLogEntry } from '@/lib/supabase';

interface ActivityLogProps {
  projectId: string;
  initialLogs: ActivityLogEntry[];
  onUpdateLogs: (logs: ActivityLogEntry[]) => void;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ projectId, initialLogs, onUpdateLogs }) => {
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [activityText, setActivityText] = useState('');
  const [activityLogs, setActivityLogs] = useState<ActivityLogEntry[]>(initialLogs);

  const toggleActivityLog = () => {
    setShowActivityLog(!showActivityLog);
  };

  const handleAddActivity = () => {
    if (activityText.trim()) {
      const newEntry: ActivityLogEntry = {
        text: activityText,
        date: new Date().toISOString()
      };
      
      const updatedLogs = [newEntry, ...activityLogs];
      setActivityLogs(updatedLogs);
      onUpdateLogs(updatedLogs);
      setActivityText('');
    }
  };

  return (
    <div className="mt-4 border-t pt-3">
      <button 
        onClick={toggleActivityLog}
        className="flex items-center justify-between w-full text-sm text-left text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="font-medium">Activity Log</span>
        {showActivityLog ? 
          <ChevronUpIcon size={16} /> : 
          <ChevronDownIcon size={16} />
        }
      </button>
      
      {showActivityLog && (
        <div className="mt-2 space-y-2">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={activityText}
              onChange={(e) => setActivityText(e.target.value)}
              placeholder="What did you accomplish?"
              className="w-full text-xs p-2 border border-input rounded-md"
              onKeyPress={(e) => e.key === 'Enter' && handleAddActivity()}
            />
            <Button 
              size="sm" 
              variant="outline" 
              className="self-end hover:bg-muted transition-colors" 
              onClick={handleAddActivity}
            >
              <PlusIcon className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
          
          <div className="mt-2 space-y-1.5">
            {activityLogs.map((entry, index) => (
              <div key={index} className="text-xs p-2 bg-muted/50 rounded-sm">
                <div className="flex flex-col">
                  <span>{entry.text}</span>
                  <span className="text-[10px] text-muted-foreground mt-1">
                    {format(new Date(entry.date), 'MMM d, yyyy - h:mm a')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;

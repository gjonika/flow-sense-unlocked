
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Milestone } from '@/lib/supabase';
import { CheckCircle, CircleDashed, Clock, PlusCircle, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl 
} from '@/components/ui/form';
import { ProjectFormValues } from '@/components/ProjectForm';

const MilestonesField: React.FC = () => {
  const { control, watch, setValue } = useFormContext<ProjectFormValues>();
  const milestones = watch('milestones');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddMilestone = () => {
    if (title.trim()) {
      const newMilestone: Milestone = {
        title: title.trim(),
        dueDate,
        status: 'pending',
      };
      setValue('milestones', [...milestones, newMilestone]);
      setTitle('');
      setDueDate(new Date().toISOString().split('T')[0]);
    }
  };

  const handleUpdateStatus = (index: number, status: 'completed' | 'in-progress' | 'pending') => {
    const updatedMilestones = [...milestones];
    updatedMilestones[index].status = status;
    setValue('milestones', updatedMilestones);
  };

  const handleRemoveMilestone = (index: number) => {
    const updatedMilestones = milestones.filter((_, i) => i !== index);
    setValue('milestones', updatedMilestones);
  };

  return (
    <FormField
      control={control}
      name="milestones"
      render={() => (
        <FormItem className="space-y-4">
          <FormLabel>Milestones</FormLabel>
          <FormControl>
            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-2">
                  <Input
                    placeholder="Milestone title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="self-end flex items-center gap-1"
                  onClick={handleAddMilestone}
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Milestone
                </Button>
              </div>

              {milestones.length > 0 && (
                <div className="space-y-2 border rounded-md p-3 bg-muted/30">
                  <h3 className="text-sm font-medium mb-2">Project Milestones</h3>
                  {milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-background p-2 rounded-md border"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">{milestone.title}</div>
                        <div className="text-xs text-muted-foreground">
                          Due: {new Date(milestone.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                      <Select 
                        value={milestone.status} 
                        onValueChange={(value) => handleUpdateStatus(index, value as 'completed' | 'in-progress' | 'pending')}
                      >
                        <SelectTrigger className="h-7 w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending" className="flex items-center">
                            <div className="flex items-center gap-1.5">
                              <CircleDashed className="h-3.5 w-3.5 text-gray-500" />
                              <span>Pending</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="in-progress" className="flex items-center">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-amber-500" />
                              <span>In Progress</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="completed" className="flex items-center">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                              <span>Completed</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleRemoveMilestone(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default MilestonesField;

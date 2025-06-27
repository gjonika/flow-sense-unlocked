
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { ProjectFormValues } from '@/components/ProjectForm';

const AccountAndLinks: React.FC = () => {
  const { control, watch, setValue } = useFormContext<ProjectFormValues>();
  const chatLinks = watch('chatLinks') || [];
  
  const addChatLink = () => {
    setValue('chatLinks', [...chatLinks, '']);
  };
  
  const removeChatLink = (index: number) => {
    const newLinks = chatLinks.filter((_, i) => i !== index);
    setValue('chatLinks', newLinks);
  };
  
  const updateChatLink = (index: number, value: string) => {
    const newLinks = [...chatLinks];
    newLinks[index] = value;
    setValue('chatLinks', newLinks);
  };
  
  return (
    <div className="space-y-4">
      {/* Account Used */}
      <FormField
        control={control}
        name="accountUsed"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Account Used</FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., @mycompany, personal account"
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* ChatGPT Links */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <FormLabel>ChatGPT Chat Links</FormLabel>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addChatLink}
            className="flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Link
          </Button>
        </div>
        
        {chatLinks.map((link, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              placeholder="https://chat.openai.com/..."
              value={link}
              onChange={(e) => updateChatLink(index, e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeChatLink(index)}
              className="p-2"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        
        {chatLinks.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No chat links added yet. Click "Add Link" to include ChatGPT conversation links.
          </p>
        )}
      </div>
    </div>
  );
};

export default AccountAndLinks;

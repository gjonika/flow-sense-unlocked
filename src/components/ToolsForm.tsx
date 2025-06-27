
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';

interface ToolsFormProps {
  tools: string[];
  onChange: (tools: string[]) => void;
}

const ToolsForm = ({ tools, onChange }: ToolsFormProps) => {
  const [newTool, setNewTool] = useState("");

  const addTool = () => {
    if (newTool.trim()) {
      onChange([...tools, newTool.trim()]);
      setNewTool("");
    }
  };

  const removeTool = (index: number) => {
    onChange(tools.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-blue-700">Tools & Equipment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tools.map((tool, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <span>{tool}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeTool(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input
              value={newTool}
              onChange={(e) => setNewTool(e.target.value)}
              placeholder="Add new tool..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTool())}
            />
            <Button type="button" onClick={addTool}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ToolsForm;

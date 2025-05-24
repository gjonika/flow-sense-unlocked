
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';

interface CustomFieldsFormProps {
  customFields: { [key: string]: string };
  onChange: (customFields: { [key: string]: string }) => void;
}

const CustomFieldsForm = ({ customFields, onChange }: CustomFieldsFormProps) => {
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");

  const addCustomField = () => {
    if (newFieldName.trim()) {
      onChange({
        ...customFields,
        [newFieldName.trim()]: newFieldValue.trim()
      });
      setNewFieldName("");
      setNewFieldValue("");
    }
  };

  const removeCustomField = (fieldName: string) => {
    const { [fieldName]: removed, ...rest } = customFields;
    onChange(rest);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-blue-700">Custom Fields</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(customFields).map(([name, value]) => (
            <div key={name} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <span><strong>{name}:</strong> {value}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeCustomField(name)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="grid md:grid-cols-3 gap-2">
            <Input
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              placeholder="Field name..."
            />
            <Input
              value={newFieldValue}
              onChange={(e) => setNewFieldValue(e.target.value)}
              placeholder="Field value..."
            />
            <Button type="button" onClick={addCustomField}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomFieldsForm;

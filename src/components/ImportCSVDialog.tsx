
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ImportCSVDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (csvContent: string) => void;
}

const TEMPLATE_CSV = `id,name,summary,description,type,usefulness,status,progress,isMonetized,githubUrl,websiteUrl,nextAction,lastUpdated,tags
,Example Project,Short summary here,Longer description,Personal,5,Idea,0,false,https://github.com/example/project,https://example.com,Next step to take,2023-05-20,Tag1;Tag2`;

const ImportCSVDialog: React.FC<ImportCSVDialogProps> = ({ isOpen, onClose, onImport }) => {
  const [csvContent, setCsvContent] = useState(TEMPLATE_CSV);
  const [importError, setImportError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvContent(content);
      setImportError(null);
    };
    reader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([TEMPLATE_CSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    try {
      setImportError(null);
      onImport(csvContent);
      onClose();
    } catch (error) {
      setImportError(`Error importing CSV: ${error instanceof Error ? error.message : String(error)}`);
      console.error('Error in CSV import:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Projects from CSV</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">
            Upload a CSV file with your projects or edit the template below.
          </p>
          
          {importError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{importError}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-between">
            <Button 
              variant="secondary" 
              className="relative"
              onClick={() => document.getElementById('csvFileInput')?.click()}
            >
              Choose CSV File
              <input
                id="csvFileInput"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="sr-only"
              />
            </Button>
            
            <Button variant="outline" onClick={handleDownloadTemplate}>
              Download Template
            </Button>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">CSV Content</h3>
            <Textarea
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              First row should contain headers. Use semicolons (;) to separate items within array fields like tags.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleImport}>Import</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportCSVDialog;


import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, AlertCircle, FileText, Download } from 'lucide-react';

interface ImportCSVDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (csvContent: string) => void;
}

// This is the example template with proper formatting
const TEMPLATE_CSV = `id,name,summary,description,type,usefulness,status,progress,isMonetized,githubUrl,websiteUrl,nextAction,lastUpdated,tags
,Example Project,Short summary here,Longer description,Personal,5,Idea,0,false,https://github.com/example/project,https://example.com,Next step to take,2023-05-20,Tag1;Tag2`;

const ImportCSVDialog: React.FC<ImportCSVDialogProps> = ({ isOpen, onClose, onImport }) => {
  const [csvContent, setCsvContent] = useState(TEMPLATE_CSV);
  const [error, setError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvContent(content);
      setError(null);
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

  const validateCSV = (content: string): boolean => {
    const lines = content.trim().split('\n');
    if (lines.length < 2) {
      setError("CSV must contain at least a header row and one data row");
      return false;
    }
    
    const headerRow = lines[0].trim();
    if (!headerRow.includes('name') || !headerRow.includes('type') || !headerRow.includes('status')) {
      setError("CSV header must include required fields: name, type, status");
      return false;
    }
    
    return true;
  };

  const handleImport = () => {
    if (validateCSV(csvContent)) {
      onImport(csvContent);
      onClose();
    } else {
      toast.error(error || "Invalid CSV format");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-baltic-fog">
        <DialogHeader>
          <DialogTitle className="text-baltic-deep">Import Projects from CSV</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">
            Upload a CSV file with your projects or edit the template below.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="secondary" 
              className="relative bg-baltic-sand text-baltic-deep hover:bg-baltic-sand/70 flex gap-2"
              onClick={() => document.getElementById('csvFileInput')?.click()}
            >
              <FileText className="w-4 h-4" />
              Choose CSV File
              <input
                id="csvFileInput"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="sr-only"
              />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleDownloadTemplate}
              className="border-baltic-sea/30 hover:bg-baltic-sand/30 flex gap-2"
            >
              <Download className="w-4 h-4" />
              Download Template
            </Button>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium text-baltic-deep">CSV Content</h3>
            <Textarea
              value={csvContent}
              onChange={(e) => {
                setCsvContent(e.target.value);
                setError(null);
              }}
              rows={8}
              className="font-mono text-sm border-baltic-sea/20 bg-white"
            />
            {error && (
              <div className="flex items-center gap-2 text-xs text-rose-500 font-medium bg-rose-50 p-2 rounded border border-rose-200">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            
            <Collapsible open={showHelp} onOpenChange={setShowHelp} className="space-y-2">
              <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-baltic-deep bg-baltic-sand/30 rounded-md hover:bg-baltic-sand/50 transition-colors">
                <span>Format Instructions</span>
                {showHelp ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="bg-white p-4 rounded-md border border-baltic-sand/50 text-xs text-muted-foreground space-y-3">
                <div>
                  <p className="font-medium mb-1 text-baltic-deep">CSV Format Rules:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>First row must contain column headers (name, type, status, etc.)</li>
                    <li>Use <span className="font-bold">commas (,)</span> to separate columns</li>
                    <li>Use <span className="font-bold">semicolons (;)</span> to separate items within tags field only (e.g., "Tag1;Tag2;Tag3")</li>
                    <li>Required fields: name, type, status</li>
                    <li>Leave the 'id' field empty for new projects</li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-medium mb-1 text-baltic-deep">Example format:</p>
                  <div className="bg-gray-50 p-2 rounded overflow-x-auto">
                    <code className="text-xs break-all whitespace-pre-wrap">
                      <span className="text-baltic-sea font-medium">id</span>,<span className="text-baltic-sea font-medium">name</span>,<span className="text-baltic-sea font-medium">summary</span>,<span className="text-baltic-sea font-medium">description</span>,<span className="text-baltic-sea font-medium">type</span>,...
                    </code>
                    <br/>
                    <code className="text-xs">
                      ,Project X,A short summary,Full description,Personal,...
                    </code>
                  </div>
                </div>
                
                <div>
                  <p className="font-medium mb-1 text-baltic-deep">Available Project Types:</p>
                  <div className="flex flex-wrap gap-1">
                    {["Personal", "Professional", "Education", "Market", "For Sale", "Open Source", "Other"].map(type => (
                      <span key={type} className="px-2 py-0.5 bg-baltic-sand/30 rounded-full text-xs">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-baltic-sea/30">Cancel</Button>
          <Button onClick={handleImport} className="bg-baltic-pine hover:bg-baltic-deep text-baltic-fog">Import</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportCSVDialog;

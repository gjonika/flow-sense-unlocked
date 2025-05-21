import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Check, AlertCircle, FileInput } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define the expected CSV structure
type CSVReading = {
  readingdate: string;
  utilitytype: string;
  supplier: string;
  reading?: string | number;
  unit?: string;
  amount: number;
  notes?: string;
};

interface UploadCSVProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const UploadCSV: React.FC<UploadCSVProps> = ({ onSuccess, onCancel }) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<CSVReading[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'upload' | 'validate' | 'import'>('upload');
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const parseCSV = async () => {
    if (!file) {
      setError('No file selected');
      return;
    }

    setError(null);
    
    try {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      // Validate headers
      const requiredHeaders = ['readingdate', 'utilitytype', 'supplier', 'amount'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        setError(`CSV is missing required headers: ${missingHeaders.join(', ')}`);
        return;
      }
      
      const parsedData: CSVReading[] = [];
      
      // Skip header row (i=0)
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue; // Skip empty lines
        
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length !== headers.length) {
          setError(`Line ${i+1} has ${values.length} values, but should have ${headers.length}`);
          return;
        }
        
        const entry: Record<string, any> = {};
        
        headers.forEach((header, index) => {
          if (header === 'amount') {
            const amount = parseFloat(values[index]);
            if (isNaN(amount)) {
              setError(`Invalid amount in line ${i+1}: ${values[index]}`);
              return;
            }
            entry[header] = amount;
          } else if (header === 'reading' && values[index]) {
            const reading = parseFloat(values[index]);
            entry[header] = isNaN(reading) ? values[index] : reading;
          } else {
            entry[header] = values[index];
          }
        });
        
        parsedData.push(entry as CSVReading);
      }
      
      if (parsedData.length === 0) {
        setError('No valid data found in CSV');
        return;
      }
      
      setParsedData(parsedData);
      setStep('validate');
    } catch (error) {
      setError('Failed to parse CSV file');
      console.error('CSV parsing error:', error);
    }
  };

  const importData = async () => {
    setStep('import');
    setProgress(0);
    
    try {
      // Process batches of 10 entries at a time
      const batchSize = 10;
      const totalEntries = parsedData.length;
      
      for (let i = 0; i < totalEntries; i += batchSize) {
        const batch = parsedData.slice(i, i + batchSize);
        
        // Properly convert and validate data before inserting
        const entriesToInsert = batch.map(entry => {
          // Handle reading conversion: string -> number or null if invalid
          let readingValue: number | null = null;
          if (entry.reading !== undefined && entry.reading !== '') {
            if (typeof entry.reading === 'number') {
              readingValue = entry.reading;
            } else {
              const parsed = parseFloat(entry.reading);
              readingValue = !isNaN(parsed) ? parsed : null;
            }
          }
          
          return {
            readingdate: entry.readingdate,
            utilitytype: entry.utilitytype,
            supplier: entry.supplier,
            reading: readingValue,
            unit: entry.unit || null,
            amount: entry.amount,
            notes: entry.notes || null
          };
        });
        
        const { error } = await supabase.from('utility_entries').insert(entriesToInsert);
        
        if (error) {
          throw error;
        }
        
        // Update progress
        setProgress(Math.min(Math.round(((i + batchSize) / totalEntries) * 100), 100));
      }
      
      toast({
        title: "Import completed",
        description: `${parsedData.length} entries imported successfully`,
      });
      
      onSuccess();
    } catch (error) {
      console.error('Import error:', error);
      setError('Failed to import data to database');
      setStep('validate');
    }
  };

  const downloadSampleCSV = () => {
    const headers = 'readingdate,utilitytype,supplier,reading,unit,amount,notes';
    const sampleData = '2025-05-01,electricity,Power Co,1234,kWh,45.50,Monthly reading\n2025-05-05,water,Water Inc,45,m3,32.20,Quarterly bill';
    const csvContent = `${headers}\n${sampleData}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'utility_entries_sample.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {step === 'upload' && (
        <>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="csv-file" className="font-medium">
                Select CSV file to import
              </label>
              <Input 
                id="csv-file"
                type="file" 
                accept=".csv" 
                onChange={handleFileChange} 
              />
              <p className="text-sm text-muted-foreground">
                File must be a CSV with the following headers: readingdate, utilitytype, supplier, amount
                (Optional headers: reading, unit, notes)
              </p>
            </div>
            
            <div className="text-sm">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={downloadSampleCSV}
              >
                <FileInput className="h-4 w-4" />
                Download Sample CSV
              </Button>
            </div>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={parseCSV} disabled={!file}>
              Next: Validate Data
            </Button>
          </div>
        </>
      )}
      
      {step === 'validate' && (
        <>
          <div>
            <h3 className="text-lg font-medium mb-2">Validation Results</h3>
            <div className="border rounded-md p-4 mb-4">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <Check className="h-5 w-5" />
                <span className="font-medium">CSV file is valid</span>
              </div>
              <p className="text-sm">
                Found {parsedData.length} entries ready to import.
              </p>
            </div>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <div className="max-h-64 overflow-auto">
              <table className="w-full">
                <thead className="bg-muted/50 sticky top-0">
                  <tr>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Type</th>
                    <th className="p-2 text-left">Supplier</th>
                    <th className="p-2 text-left">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedData.slice(0, 5).map((entry, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">{entry.readingdate}</td>
                      <td className="p-2">{entry.utilitytype}</td>
                      <td className="p-2">{entry.supplier}</td>
                      <td className="p-2">${entry.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                  {parsedData.length > 5 && (
                    <tr className="border-t">
                      <td colSpan={4} className="p-2 text-center text-muted-foreground">
                        {parsedData.length - 5} more entries...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setStep('upload')}>
              Back
            </Button>
            <Button onClick={importData}>
              Import Data
            </Button>
          </div>
        </>
      )}
      
      {step === 'import' && (
        <div className="flex flex-col items-center gap-6 py-8">
          <h3 className="text-lg font-medium">Importing Data...</h3>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">
            Imported {Math.floor((parsedData.length * progress) / 100)} of {parsedData.length} entries
          </p>
        </div>
      )}
    </div>
  );
};

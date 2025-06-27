
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ErrorDisplayProps {
  error: string;
  errorDetails?: string | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, errorDetails }) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error Generating Insights</AlertTitle>
      <AlertDescription>
        <p>{error}</p>
        {errorDetails && (
          <details className="mt-2 text-xs">
            <summary>Technical Details</summary>
            <pre className="mt-2 whitespace-pre-wrap">{errorDetails}</pre>
          </details>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorDisplay;

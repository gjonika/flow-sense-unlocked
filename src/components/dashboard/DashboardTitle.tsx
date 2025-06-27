
import React from 'react';
import { ClipboardCheckIcon } from 'lucide-react';

const DashboardTitle: React.FC = () => {
  return (
    <div className="flex items-center space-x-4">
      <div className="icon-contextual">
        <ClipboardCheckIcon className="h-8 w-8 text-primary" />
      </div>
      <div>
        <h1 className="text-primary-title text-foreground">
          Ivory Olive
        </h1>
        <p className="text-body-sm text-muted-foreground mt-1">
          Track and manage your side projects with precision
        </p>
      </div>
    </div>
  );
};

export default DashboardTitle;

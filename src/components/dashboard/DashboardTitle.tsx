
import React from 'react';

const DashboardTitle: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-page-title text-gray-text mb-2">
        Survey Management Dashboard
      </h1>
      <p className="text-body-sm text-muted-foreground">
        Manage cruise ship interior assessments and compliance surveys
      </p>
    </div>
  );
};

export default DashboardTitle;

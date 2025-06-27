
import React from 'react';
import { Button } from '@/components/ui/button';

const SkipNavigation: React.FC = () => {
  const skipToContent = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const skipToNav = () => {
    const navigation = document.getElementById('main-navigation');
    if (navigation) {
      navigation.focus();
      navigation.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sr-only focus-within:not-sr-only">
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={skipToContent}
          className="focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-background border-2 border-primary"
        >
          Skip to main content
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={skipToNav}
          className="focus:not-sr-only focus:absolute focus:top-0 focus:left-12 bg-background border-2 border-primary"
        >
          Skip to navigation
        </Button>
      </div>
    </div>
  );
};

export default SkipNavigation;

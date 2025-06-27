
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { 
  MenuIcon, 
  PlusIcon, 
  FileTextIcon, 
  LineChart,
  ListTodoIcon,
  BrainIcon,
  DownloadIcon 
} from 'lucide-react';

interface MobileNavProps {
  onAddProject: () => void;
  onToggleAnalytics: () => void;
  onTogglePriorities: () => void;
  onToggleAISupport: () => void;
  onImport: () => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  showAnalytics: boolean;
  showPriorities: boolean;
  showAISupport: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({
  onAddProject,
  onToggleAnalytics,
  onTogglePriorities,
  onToggleAISupport,
  onImport,
  onExportCSV,
  onExportJSON,
  showAnalytics,
  showPriorities,
  showAISupport,
}) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden touch-target hover-scale"
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle>Dashboard Menu</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          {/* Primary Actions */}
          <div className="space-y-3">
            <Button 
              onClick={onAddProject}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground touch-target"
              size="lg"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add New Project
            </Button>
          </div>

          {/* Dashboard Controls */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Dashboard Views</h3>
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant={showAnalytics ? "default" : "outline"}
                onClick={onToggleAnalytics}
                className="w-full touch-target justify-start"
              >
                <LineChart className="h-4 w-4 mr-2" />
                {showAnalytics ? 'Hide' : 'Show'} Analytics
              </Button>
              
              <Button
                variant={showPriorities ? "default" : "outline"}
                onClick={onTogglePriorities}
                className="w-full touch-target justify-start"
              >
                <ListTodoIcon className="h-4 w-4 mr-2" />
                {showPriorities ? 'Hide' : 'Show'} Priorities
              </Button>
              
              <Button
                variant={showAISupport ? "default" : "outline"}
                onClick={onToggleAISupport}
                className="w-full touch-target justify-start"
              >
                <BrainIcon className="h-4 w-4 mr-2" />
                {showAISupport ? 'Hide' : 'Show'} AI Support
              </Button>
            </div>
          </div>

          {/* Import/Export */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Data Management</h3>
            <div className="space-y-2">
              <Button 
                variant="outline"
                onClick={onImport}
                className="w-full touch-target justify-start"
              >
                <FileTextIcon className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={onExportCSV}
                  className="touch-target"
                >
                  <DownloadIcon className="h-4 w-4 mr-1" />
                  Export CSV
                </Button>
                <Button
                  variant="outline"
                  onClick={onExportJSON}
                  className="touch-target"
                >
                  <DownloadIcon className="h-4 w-4 mr-1" />
                  Export JSON
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileNav;

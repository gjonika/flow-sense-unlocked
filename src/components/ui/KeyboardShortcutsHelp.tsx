
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Keyboard, Plus, Search, BarChart3, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const KeyboardShortcutsHelp: React.FC = () => {
  const [open, setOpen] = useState(false);

  const shortcuts = [
    { keys: ['Ctrl', 'N'], description: 'Add new project', icon: Plus },
    { keys: ['Ctrl', 'K'], description: 'Search projects', icon: Search },
    { keys: ['Ctrl', 'A'], description: 'Toggle analytics', icon: BarChart3 },
    { keys: ['Ctrl', 'R'], description: 'Refresh data', icon: RefreshCw },
    { keys: ['Escape'], description: 'Close dialogs/modals' },
    { keys: ['Tab'], description: 'Navigate between elements' },
    { keys: ['Enter'], description: 'Activate focused element' },
    { keys: ['Space'], description: 'Toggle checkboxes/buttons' },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
          aria-label="Show keyboard shortcuts help"
        >
          <Keyboard className="h-4 w-4" />
          <span className="hidden sm:inline">Shortcuts</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {shortcuts.map(({ keys, description, icon: Icon }, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-1">
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                <span className="text-sm">{description}</span>
              </div>
              <div className="flex gap-1">
                {keys.map((key, keyIndex) => (
                  <Badge
                    key={keyIndex}
                    variant="outline"
                    className="text-xs font-mono px-2 py-1"
                  >
                    {key}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted rounded-md">
          <p>💡 Tip: Press <Badge variant="outline" className="text-xs">?</Badge> to show this help anytime</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsHelp;

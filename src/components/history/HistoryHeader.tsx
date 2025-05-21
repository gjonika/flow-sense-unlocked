
import { Button } from "@/components/ui/button";
import { Trash2, Upload } from "lucide-react";

interface HistoryHeaderProps {
  setDeleteConfirmOpen: (open: boolean) => void;
  setImportDialogOpen: (open: boolean) => void;
}

export const HistoryHeader = ({
  setDeleteConfirmOpen,
  setImportDialogOpen
}: HistoryHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reading History</h1>
        <p className="text-muted-foreground">
          View and filter all your past utility readings
        </p>
      </div>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          onClick={() => setDeleteConfirmOpen(true)}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete All
        </Button>
        <Button 
          onClick={() => setImportDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Import CSV
        </Button>
      </div>
    </div>
  );
};

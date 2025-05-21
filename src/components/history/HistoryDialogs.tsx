
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { UploadCSV } from "@/components/UploadCSV";

interface HistoryDialogsProps {
  importDialogOpen: boolean;
  setImportDialogOpen: (open: boolean) => void;
  deleteConfirmOpen: boolean;
  setDeleteConfirmOpen: (open: boolean) => void;
  handleDeleteAll: () => Promise<void>;
  handleImportSuccess: () => void;
}

export const HistoryDialogs = ({
  importDialogOpen,
  setImportDialogOpen,
  deleteConfirmOpen,
  setDeleteConfirmOpen,
  handleDeleteAll,
  handleImportSuccess,
}: HistoryDialogsProps) => {
  return (
    <>
      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>Import Utility Entries</DialogTitle>
          </DialogHeader>
          <UploadCSV onSuccess={handleImportSuccess} onCancel={() => setImportDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all your utility readings data from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAll} className="bg-destructive text-destructive-foreground">
              Yes, delete all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

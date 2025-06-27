
import { Dialog, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Project } from '@/lib/supabase';

interface ProjectFormHeaderProps {
  initialData?: Project;
  onClose: () => void;
  onSave: () => void;
}

const ProjectFormHeader: React.FC<ProjectFormHeaderProps> = ({
  initialData,
  onClose,
  onSave
}) => {
  return (
    <DialogHeader className="flex flex-row items-center justify-between sticky top-0 bg-background z-10 py-4 border-b">
      <DialogTitle className="px-0 my-0 py-0 mx-[15px]">
        {initialData ? 'Edit Project' : 'Add New Project'}
      </DialogTitle>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          type="button" 
          onClick={onClose} 
          size="sm" 
          className="mx-0 my-0 px-[10px]"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          onClick={onSave}
          size="sm" 
          className="bg-olive hover:bg-olive-dark my-0 mx-[15px] px-[40px]"
        >
          {initialData ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </DialogHeader>
  );
};

export default ProjectFormHeader;


import React from 'react';
import { Github, Globe, MessageSquare, Tag, Calendar, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormFieldIconProps {
  type: 'github' | 'website' | 'chat' | 'tag' | 'deadline' | 'goal';
  className?: string;
}

const iconMap = {
  github: Github,
  website: Globe,
  chat: MessageSquare,
  tag: Tag,
  deadline: Calendar,
  goal: Target,
};

const FormFieldIcon: React.FC<FormFieldIconProps> = ({ type, className }) => {
  const Icon = iconMap[type];
  
  return (
    <Icon 
      className={cn(
        "h-4 w-4 text-muted-foreground/60 transition-colors duration-200",
        "group-focus-within:text-primary/60",
        className
      )} 
    />
  );
};

export default FormFieldIcon;

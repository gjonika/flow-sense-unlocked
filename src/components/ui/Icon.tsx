
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  icon: LucideIcon;
  size?: number | string;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({ 
  icon: LucideComp, 
  size = 20, 
  color = 'currentColor', 
  className,
  ...props 
}) => {
  return (
    <LucideComp 
      size={size} 
      color={color} 
      className={cn("transition-colors duration-200", className)}
      {...props} 
    />
  );
};

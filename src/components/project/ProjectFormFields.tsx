
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ProjectFormValues } from '../ProjectForm';
import ProjectBasicInfo from './form/ProjectBasicInfo';
import ProjectStatusType from './form/ProjectStatusType';
import UsefulnessMonetization from './form/UsefulnessMonetization';
import ProgressSlider from './form/ProgressSlider';
import TagsSection from './form/TagsSection';
import MilestonesField from './MilestonesField';
import ProjectUrls from './form/ProjectUrls';
import NextAction from './form/NextAction';
import AccountAndLinks from './form/AccountAndLinks';
import AnalysisAndTasks from './form/AnalysisAndTasks';

const ProjectFormFields: React.FC = () => {
  const methods = useFormContext<ProjectFormValues>();
  
  return (
    <div className="space-y-6">
      {/* Basic project information */}
      <ProjectBasicInfo />
      
      {/* Status and Type */}
      <ProjectStatusType />
      
      {/* Usefulness and Monetization */}
      <UsefulnessMonetization />
      
      {/* Progress slider */}
      <ProgressSlider />
      
      {/* Tags */}
      <TagsSection />

      {/* Milestones */}
      <div className="space-y-2">
        <MilestonesField />
      </div>
      
      {/* URLs section */}
      <ProjectUrls />
      
      {/* Account and Chat Links */}
      <AccountAndLinks />
      
      {/* Analysis and AI Tasks */}
      <AnalysisAndTasks />
      
      {/* Next action */}
      <NextAction />
    </div>
  );
};

export default ProjectFormFields;

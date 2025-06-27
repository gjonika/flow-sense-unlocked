
import React from 'react';
import AnalysisTextInput from './AnalysisTextInput';
import TaskGenerationButtons from './TaskGenerationButtons';
import TasksPreview from './TasksPreview';

const AnalysisAndTasks: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Analysis Text */}
      <AnalysisTextInput />
      
      {/* Generate Tasks Buttons */}
      <TaskGenerationButtons />
      
      {/* Tasks Preview */}
      <TasksPreview />
    </div>
  );
};

export default AnalysisAndTasks;

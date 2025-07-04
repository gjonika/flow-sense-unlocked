
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import { ProjectProvider } from '@/contexts/ProjectContext';
import GlobalTasks from '@/pages/GlobalTasks';
import Deadlines from '@/pages/Deadlines';
import { MotionProvider } from '@/components/ui/ReducedMotion';

function App() {
  return (
    <MotionProvider>
      <ProjectProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tasks" element={<GlobalTasks />} />
              <Route path="/deadlines" element={<Deadlines />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </ProjectProvider>
    </MotionProvider>
  );
}

export default App;

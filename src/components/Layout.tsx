
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { MenuIcon, X } from "lucide-react";
import { Button } from "./ui/button";

const Layout = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button 
          variant="outline" 
          size="icon"
          onClick={toggleSidebar}
          className="rounded-full shadow-md"
        >
          {sidebarVisible ? <X className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar for desktop and conditionally for mobile */}
      <div 
        className={`
          ${sidebarVisible ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 
          transition-transform duration-300 ease-in-out
          fixed inset-y-0 left-0 z-40 w-64 lg:w-72
        `}
      >
        <Sidebar closeMobileSidebar={() => setSidebarVisible(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 ml-0 lg:ml-72">
        <main className="p-4 lg:p-8 w-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarVisible && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setSidebarVisible(false)}
        ></div>
      )}
    </div>
  );
};

export default Layout;

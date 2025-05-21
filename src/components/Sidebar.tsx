import { Calendar } from "lucide-react";
import { CalendarIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ColorPicker";
import {
  Home,
  PlusCircle,
  History,
  BarChart3,
  // Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Building
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  closeMobileSidebar: () => void;
}

const Sidebar = ({ closeMobileSidebar }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, signOut } = useAuth();

  // Check if sidebar was collapsed in previous session
  useEffect(() => {
    const savedCollapsed = localStorage.getItem("sidebar-collapsed");
    if (savedCollapsed) {
      setCollapsed(savedCollapsed === "true");
    }
  }, []);

  // Save sidebar state when it changes
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const navItems = [

    { title: "Dashboard", path: "/", icon: <Home className="h-5 w-5" /> },
    { title: "Add Reading", path: "/add-reading", icon: <PlusCircle className="h-5 w-5" /> },
    { title: "Monthly Readings", path: "/monthly", icon: <Calendar className="h-5 w-5" /> },
    { title: "History", path: "/history", icon: <History className="h-5 w-5" /> },
    { title: "Analytics", path: "/analytics", icon: <BarChart3 className="h-5 w-5" /> },
    { title: "Suppliers", path: "/suppliers", icon: <Building className="h-5 w-5" /> },
    // { title: "Settings", path: "/settings", icon: <Settings className="h-5 w-5" /> },
    // { title: "Profile", path: "/profile", icon: <User className="h-5 w-5" /> }
  ];

  // Get user initials or use fallback
  const email = user?.email || '';
  const initials = email ? email.charAt(0).toUpperCase() : 'U';

  return (
    <div className={`h-full bg-card border-r flex flex-col relative transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Toggle button */}
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background shadow-md z-10"
        onClick={toggleSidebar}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* App Logo/Title */}
      <div className={`p-6 border-b flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
        <h1 className={`text-2xl font-bold text-primary flex items-center gap-2 ${collapsed ? 'sr-only' : ''}`}>
          <span className="w-2 h-6 bg-primary rounded-sm animate-pulse-light"></span>
          UtilityFlow
        </h1>
        {collapsed ? (
          <span className="w-2 h-6 bg-primary rounded-sm animate-pulse-light"></span>
        ) : (
          <ColorPicker />
        )}
      </div>

      {/* Navigation Links */}
      <nav className="mt-6 flex-1 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={closeMobileSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-md transition-colors
                  ${isActive
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'hover:bg-accent hover:text-accent-foreground'
                  } ${collapsed ? 'justify-center' : ''}`
                }
                end={item.path === "/"}
                title={collapsed ? item.title : undefined}
              >
                <span className="text-foreground">{item.icon}</span>
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            </li>
          ))}

          <li className="pt-4">
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-destructive hover:bg-destructive/10 hover:text-destructive ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? "Sign Out" : undefined}
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span>Sign Out</span>}
            </Button>
          </li>
        </ul>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t mt-auto">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3 px-4 py-2'}`}>
          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold">
            {initials}
          </div>
          {!collapsed && user && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user.email}</p>
              <p className="text-xs text-muted-foreground">Logged in</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

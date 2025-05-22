
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProjectProvider } from "@/contexts/ProjectContext";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { signInAnonymously, checkAuth } from "@/lib/supabase";
import { toast } from "sonner";

// Set up React Query with some retry logic for network errors
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on network errors with our fallback system
        if (error?.message?.includes('fetch') || failureCount > 2) {
          return false;
        }
        return true;
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const initAuth = async () => {
      try {
        // First check if already authenticated
        const isAuthed = await checkAuth();
        
        if (!isAuthed) {
          // Sign in anonymously if not authenticated
          const success = await signInAnonymously();
          setIsAuthenticated(success);
          
          if (!success) {
            toast.error("Authentication failed. Using offline mode.");
          }
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setIsAuthenticated(false);
        toast.error("Authentication error. Using offline mode.");
      }
    };
    
    initAuth();
  }, []);
  
  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive mx-auto mb-4"></div>
          <p className="text-olive">Loading your projects...</p>
        </div>
      </div>
    );
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ProjectProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ProjectProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

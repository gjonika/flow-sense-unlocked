
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export function AuthWelcome() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return null;
  
  if (user) {
    return (
      <Alert className="mb-6 bg-primary/10 border-primary">
        <AlertTitle className="flex items-center gap-2">
          <span>Welcome back!</span>
        </AlertTitle>
        <AlertDescription>
          You're signed in as {user.email}. Now you can track and manage your utility readings.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Alert className="mb-6 bg-destructive/10 border-destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Not signed in</AlertTitle>
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
        <span>You're not currently signed in. Sign in to save your readings.</span>
        <Button size="sm" asChild>
          <Link to="/auth">
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}

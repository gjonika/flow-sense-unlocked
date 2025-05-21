
import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Get the session and route accordingly
      const { data } = await supabase.auth.getSession();
      
      // Navigate to dashboard if authenticated, otherwise to login
      if (data.session) {
        navigate('/', { replace: true });
      } else {
        navigate('/auth', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Processing authentication...</h2>
        <p className="text-muted-foreground mt-2">Please wait while we authenticate you.</p>
      </div>
    </div>
  );
};

export default AuthCallback;

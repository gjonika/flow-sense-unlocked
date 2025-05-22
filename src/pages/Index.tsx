
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to dashboard
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 text-olive-dark">Loading Project Dashboard...</h1>
      </div>
    </div>
  );
};

export default Index;

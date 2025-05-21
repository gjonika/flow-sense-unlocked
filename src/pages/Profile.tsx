
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Your Profile</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p>{user?.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">User ID</h3>
              <p className="text-sm break-all">{user?.id}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Auth Provider</h3>
            <p className="capitalize">{user?.app_metadata?.provider || 'email'}</p>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <p className="text-sm text-muted-foreground">
            Account created: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;

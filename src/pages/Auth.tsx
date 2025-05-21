
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Github, LogIn, Mail, Cpu, ArrowRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Auth = () => {
  const { user, signIn, signUp, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // If user is already logged in, redirect to dashboard
  if (user && !isLoading) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsAuthenticating(true);
    try {
      await signIn('password', email, password);
      navigate('/');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsAuthenticating(true);
    try {
      await signUp(email, password);
      // Don't navigate - wait for email confirmation
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setAuthError(null);
    try {
      await signIn(provider);
      // Redirect happens automatically
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : `${provider} authentication failed`);
    }
  };

  const handleDevSignIn = async () => {
    setAuthError(null);
    setIsAuthenticating(true);
    try {
      await signIn('dev');
      navigate('/');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Developer authentication failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary">UtilityFlow</h1>
          <p className="mt-2 text-muted-foreground">Monitor and track your utility usage</p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {authError && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}

          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Sign in to your account to continue
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isAuthenticating}
                  >
                    {isAuthenticating ? 'Signing in...' : 'Sign In'}
                    <LogIn className="ml-2 h-4 w-4" />
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => handleOAuthSignIn('google')}
                    disabled={isAuthenticating}
                    className="w-full"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleOAuthSignIn('github')}
                    disabled={isAuthenticating}
                    className="w-full"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  onClick={handleDevSignIn}
                  disabled={isAuthenticating}
                  className="w-full"
                >
                  <Cpu className="mr-2 h-4 w-4" />
                  Developer Login
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                  Enter your email and password to create an account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 6 characters
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isAuthenticating}
                  >
                    {isAuthenticating ? 'Creating Account...' : 'Create Account'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;

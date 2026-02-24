import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Layout } from '@/components/layout/Layout';
import { toast } from '@/hooks/use-toast';
import { Dog, Mail, Lock, User, Phone, MapPin, Shield } from 'lucide-react';

export default function AuthPage() {
  const { login, register, verifyOtp, pendingVerification, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('owner');

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await login(loginEmail, loginPassword);
    
    if (result.success) {
      toast({ title: 'Welcome back!', description: 'You have been logged in successfully.' });
      navigate('/dashboard');
    } else {
      toast({ title: 'Login failed', description: result.error, variant: 'destructive' });
    }
    
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await register({
      name: regName,
      email: regEmail,
      password: regPassword,
      phone: regPhone,
      address: regAddress,
      role: regRole
    });
    
    if (result.success) {
      toast({ 
        title: 'Registration successful!', 
        description: 'Please check the console for your OTP code (mock email).' 
      });
    } else {
      toast({ title: 'Registration failed', description: result.error, variant: 'destructive' });
    }
    
    setIsLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await verifyOtp(otp);
    
    if (result.success) {
      toast({ title: 'Account verified!', description: 'Your account is now active.' });
      navigate('/dashboard');
    } else {
      toast({ title: 'Verification failed', description: result.error, variant: 'destructive' });
    }
    
    setIsLoading(false);
  };

  // Show OTP verification form if pending
  if (pendingVerification) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Verify Your Email</CardTitle>
                <CardDescription>
                  We've sent a verification code to {pendingVerification}. 
                  Check the browser console for the mock OTP.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">Verification Code</Label>
                    <Input
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Verifying...' : 'Verify Account'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
              <Dog className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">PetChip Registry</h1>
            <p className="text-muted-foreground">Access your account or create a new one</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>
                  
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-2">Demo Accounts:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>Owner: owner@demo.com / demo123</li>
                      <li>Vet: vet@demo.com / demo123</li>
                      <li>Shelter: shelter@demo.com / demo123</li>
                      <li>Admin: admin@demo.com / demo123</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>Register to manage your pets' microchip records</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reg-name"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="John Smith"
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reg-email"
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reg-password"
                          type="password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="••••••••"
                          className="pl-9"
                          required
                          minLength={6}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reg-phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reg-phone"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="+1-555-0100"
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reg-address">Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reg-address"
                          value={regAddress}
                          onChange={(e) => setRegAddress(e.target.value)}
                          placeholder="123 Main St, City, State"
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reg-role">Account Type</Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                        <Select value={regRole} onValueChange={(v) => setRegRole(v as UserRole)}>
                          <SelectTrigger className="pl-9">
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="owner">Pet Owner</SelectItem>
                            <SelectItem value="vet">Veterinarian</SelectItem>
                            <SelectItem value="shelter">Animal Shelter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}

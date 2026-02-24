import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Dog, Shield, Heart, Users, FileCheck } from 'lucide-react';

export default function Index() {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-accent/20 px-4 py-1.5 rounded-full text-sm mb-6">
              <Shield className="w-4 h-4" />
              Official Pet Registration System
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              National Dog Microchip Registration & Tracking System
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Register your pet's microchip, update health records, and help reunite lost pets with their families.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/lookup">
                <Button size="lg" variant="secondary" className="gap-2 w-full sm:w-auto">
                  <Search className="w-5 h-5" />
                  Lookup Chip ID
                </Button>
              </Link>
              <Link to={isAuthenticated ? '/dashboard' : '/auth'}>
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  <Dog className="w-5 h-5" />
                  {isAuthenticated ? 'Go to Dashboard' : 'Register Your Pet'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            How PetChip Registry Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <Dog className="w-7 h-7 text-primary" />
                </div>
                <CardTitle>Register Your Pet</CardTitle>
                <CardDescription>
                  Submit your dog's microchip details along with their profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Owners can easily register their pets' microchip IDs, including breed, age, color, and photo.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-2">
                  <FileCheck className="w-7 h-7 text-accent" />
                </div>
                <CardTitle>Verification & Approval</CardTitle>
                <CardDescription>
                  Administrators review and approve chip registrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Each registration is verified to ensure accuracy and prevent duplicate entries.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-14 h-14 bg-success/10 rounded-lg flex items-center justify-center mb-2">
                  <Heart className="w-7 h-7 text-success" />
                </div>
                <CardTitle>Health Tracking</CardTitle>
                <CardDescription>
                  Veterinarians update vaccination and health records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Keep your pet's health records up-to-date with vet-verified vaccination history.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-16 bg-muted">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            For Everyone in Pet Care
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Our system serves pet owners, veterinarians, shelters, and administrators with role-specific features.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card p-6 rounded-lg border">
              <Users className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Pet Owners</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Register microchip</li>
                <li>• Manage pet profiles</li>
                <li>• View health records</li>
              </ul>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <Heart className="w-8 h-8 text-accent mb-3" />
              <h3 className="font-semibold mb-2">Veterinarians</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Look up any chip</li>
                <li>• Update vaccinations</li>
                <li>• Add health notes</li>
              </ul>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <Dog className="w-8 h-8 text-warning mb-3" />
              <h3 className="font-semibold mb-2">Shelters</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Identify lost pets</li>
                <li>• View owner contacts</li>
                <li>• Help reunite families</li>
              </ul>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <Shield className="w-8 h-8 text-destructive mb-3" />
              <h3 className="font-semibold mb-2">Administrators</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Approve registrations</li>
                <li>• Manage users</li>
                <li>• System oversight</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Register Your Pet?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of responsible pet owners who have registered their pets' microchips.
            </p>
            <Link to={isAuthenticated ? '/dashboard' : '/auth'}>
              <Button size="lg" className="gap-2">
                <Dog className="w-5 h-5" />
                {isAuthenticated ? 'Access Dashboard' : 'Get Started Today'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

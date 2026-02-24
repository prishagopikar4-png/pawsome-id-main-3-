import { Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useDogs } from '@/hooks/useDogs';
import { Dog, Plus, Search, FileCheck, Users } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const { getDogsByOwner, getAllDogs } = useDogs();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const userDogs = user?.role === 'owner' ? getDogsByOwner(user.id) : [];
  const allDogs = user?.role === 'admin' ? getAllDogs() : [];
  const pendingDogs = allDogs.filter(d => d.status === 'pending');

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground capitalize">{user?.role} Dashboard</p>
        </div>

        {/* Owner Dashboard */}
        {user?.role === 'owner' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">My Registered Dogs</h2>
              <Link to="/register-dog">
                <Button className="gap-2"><Plus className="w-4 h-4" /> Register New Dog</Button>
              </Link>
            </div>

            {userDogs.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userDogs.map(dog => (
                  <Card key={dog.id}>
                    <CardHeader className="pb-2">
                      <div className="flex gap-3">
                        <img src={dog.photo} alt={dog.name} className="w-16 h-16 rounded object-cover" />
                        <div>
                          <CardTitle className="text-base">{dog.name}</CardTitle>
                          <CardDescription className="font-mono text-xs">{dog.chipId}</CardDescription>
                          <span className={`gov-badge mt-1 ${dog.status === 'approved' ? 'status-approved' : dog.status === 'pending' ? 'status-pending' : 'status-rejected'}`}>
                            {dog.status}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{dog.breed} • {dog.age} yrs • {dog.color}</p>
                      <div className="mt-3 flex justify-center">
                        <QRCodeSVG value={`${window.location.origin}/lookup?chip=${dog.chipId}`} size={60} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card><CardContent className="py-8 text-center text-muted-foreground">No dogs registered yet.</CardContent></Card>
            )}
          </div>
        )}

        {/* Vet/Shelter Dashboard */}
        {(user?.role === 'vet' || user?.role === 'shelter') && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Veterinarian Dashboard</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" /> Chip Lookup
                  </CardTitle>
                  <CardDescription>Search for dogs by microchip ID</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/lookup">
                    <Button className="w-full">Go to Lookup</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5" /> All Dogs
                  </CardTitle>
                  <CardDescription>View and manage all registered dogs</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/dogs">
                    <Button className="w-full">View All Dogs</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {user?.role === 'vet' && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Add Health Record</CardTitle>
                      <CardDescription>Record new health information</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Search for a dog first to add health records.
                      </p>
                      <Link to="/lookup">
                        <Button variant="outline" className="w-full">
                          Find Dog to Update
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Recent Updates</CardTitle>
                      <CardDescription>Latest health records</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        View recent health updates in the dogs section.
                      </p>
                      <Link to="/dogs" className="mt-3 inline-block">
                        <Button variant="outline" className="w-full">
                          View All Dogs
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Admin Dashboard */}
        {user?.role === 'admin' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <Card><CardContent className="pt-6 text-center"><p className="text-3xl font-bold">{allDogs.length}</p><p className="text-muted-foreground">Total Dogs</p></CardContent></Card>
              <Card><CardContent className="pt-6 text-center"><p className="text-3xl font-bold text-warning">{pendingDogs.length}</p><p className="text-muted-foreground">Pending Approval</p></CardContent></Card>
              <Card><CardContent className="pt-6 text-center"><p className="text-3xl font-bold text-success">{allDogs.filter(d => d.status === 'approved').length}</p><p className="text-muted-foreground">Approved</p></CardContent></Card>
            </div>
            <Link to="/admin"><Button>Go to Admin Panel</Button></Link>
          </div>
        )}
      </div>
    </Layout>
  );
}

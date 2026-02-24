import { useAuth } from '@/contexts/AuthContext';
import { useDogs } from '@/hooks/useDogs';
import { Dog, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function DogsList() {
  const { user } = useAuth();
  const { getAllDogs } = useDogs();
  const [searchTerm, setSearchTerm] = useState('');

  const dogs = getAllDogs().filter(dog => 
    dog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dog.chipId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dog.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">All Dogs</h1>
          <p className="text-muted-foreground">View and manage all registered dogs</p>
        </div>
        {user?.role === 'owner' && (
          <Button asChild>
            <Link to="/register-dog" className="gap-2">
              <span className="text-sm">Register New Dog</span>
            </Link>
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search dogs by name, chip ID, or breed..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {dogs.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dogs.map(dog => (
              <Card key={dog.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Dog className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{dog.name}</CardTitle>
                      <CardDescription className="font-mono text-xs">{dog.chipId}</CardDescription>
                      <span className={`inline-block px-2 py-0.5 text-xs rounded-full mt-1 ${
                        dog.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : dog.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {dog.status}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center pt-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/dogs/${dog.id}`}>View Details</Link>
                    </Button>
                    {user?.role === 'vet' && (
                      <Button asChild size="sm">
                        <Link to={`/health-update/${dog.id}`}>Update Health</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No dogs found matching your search.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

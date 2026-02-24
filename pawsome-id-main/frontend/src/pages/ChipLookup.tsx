import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDogs } from '@/hooks/useDogs';
import { useHealthRecords } from '@/hooks/useHealthRecords';
import { getUsers } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Dog, User, Syringe, MapPin, Calendar, QrCode, AlertCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function ChipLookup() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();
  
  const { getDogByChip } = useDogs();
  const { getRecordsByDog } = useHealthRecords();
  const { user } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const performSearch = (query: string) => {
    const q = (query || '').trim();
    setSearched(true);
    const API_BASE = (import.meta as any).env.VITE_API_BASE || '';

    if (API_BASE) {
      const base = API_BASE.replace(/\/$/, '');
      fetch(`${base}/dogs/chip/${encodeURIComponent(q)}`)
        .then(async (res) => {
          if (!res.ok) throw new Error('Not found');
          return res.json();
        })
        .then(async (dog) => {
          let healthRecords: any[] = [];
          try {
            const hrRes = await fetch(`${base}/dogs/${dog._id || dog.id}/health`);
            if (hrRes.ok) healthRecords = await hrRes.json();
          } catch (e) {
            healthRecords = [];
          }

          // fetch owner info if available
          let owner = null;
          try {
            if (dog.ownerId) {
              const ownerRes = await fetch(`${base}/auth/users/${dog.ownerId}`);
              if (ownerRes.ok) owner = await ownerRes.json();
            }
          } catch (e) {
            owner = null;
          }

          setSearchResult({ dog, healthRecords, owner });
        })
        .catch(() => setSearchResult(null));

      return;
    }

    // Fallback: local storage
    const dog = getDogByChip(q);

    if (dog) {
      const healthRecords = getRecordsByDog(dog.id);
      const users = getUsers();
      const owner = users.find(u => u.id === dog.ownerId);

      setSearchResult({
        dog,
        healthRecords,
        owner: owner
          ? { name: owner.name, phone: owner.phone, email: owner.email }
          : null,
      });
    } else {
      setSearchResult(null);
    }
  };

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const chip = params.get('chip');
    if (chip) {
      setSearchQuery(chip);
      performSearch(chip);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const canViewOwnerContact = user?.role === 'admin' || user?.role === 'shelter' || user?.role === 'vet';

  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Chip Lookup</h1>
          <p className="text-muted-foreground">
            Search for a registered dog using their microchip ID or scan a QR code
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Chip ID (e.g., CHIP-2024-001234)"
                className="pl-9"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
          
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Try: CHIP-2024-001234, CHIP-2024-005678, or CHIP-2024-009012
          </p>
        </div>

        {/* Search Results */}
        {searched && (
          <>
            {searchResult ? (
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Dog Info Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <img 
                        src={searchResult.dog.photo} 
                        alt={searchResult.dog.name}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle>{searchResult.dog.name}</CardTitle>
                          <span className={`gov-badge ${
                            searchResult.dog.status === 'approved' ? 'status-approved' :
                            searchResult.dog.status === 'pending' ? 'status-pending' : 'status-rejected'
                          }`}>
                            {searchResult.dog.status}
                          </span>
                        </div>
                        <CardDescription className="font-mono">
                          {searchResult.dog.chipId}
                        </CardDescription>
                      </div>
                      <div className="bg-white p-2 rounded border">
                        <QRCodeSVG 
                          value={`${window.location.origin}/lookup?chip=${searchResult.dog.chipId}`}
                          size={80}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Dog className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Breed:</span>
                        <span>{searchResult.dog.breed}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Age:</span>
                        <span>{searchResult.dog.age} years</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Gender:</span>
                        <span className="capitalize">{searchResult.dog.gender}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Color:</span>
                        <span>{searchResult.dog.color}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Implant Date:</span>
                        <span>{searchResult.dog.implantDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Location:</span>
                        <span>{searchResult.dog.implantLocation}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Owner Contact - Role Based */}
                {searchResult.owner && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <User className="w-5 h-5" />
                        Owner Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {canViewOwnerContact ? (
                        <div className="space-y-2">
                          <p><strong>Name:</strong> {searchResult.owner.name}</p>
                          <p><strong>Phone:</strong> {searchResult.owner.phone}</p>
                          <p><strong>Email:</strong> {searchResult.owner.email}</p>
                        </div>
                      ) : (
                        <div className="bg-muted p-4 rounded-lg text-center">
                          <p className="text-muted-foreground">
                            Owner contact information is only visible to verified veterinarians, shelters, and administrators.
                          </p>
                          {!user && (
                            <Button variant="link" onClick={() => navigate('/auth')}>
                              Login to view contact details
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Health Records */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Syringe className="w-5 h-5" />
                      Vaccination & Health Records
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {searchResult.healthRecords.length > 0 ? (
                      <div className="space-y-3">
                        {searchResult.healthRecords.map((record: any) => (
                          <div key={record.id} className="p-3 bg-muted rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{record.vaccinationName}</p>
                                <p className="text-sm text-muted-foreground">{record.notes}</p>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {record.vaccinationDate}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        No health records available for this pet.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="max-w-xl mx-auto">
                <CardContent className="py-12 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
                  <p className="text-muted-foreground">
                    We couldn't find a registered dog with chip ID "{searchQuery}".
                    Please check the ID and try again.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

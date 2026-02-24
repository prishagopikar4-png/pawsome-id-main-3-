import { useParams, useNavigate } from 'react-router-dom';
import { useDogs } from '@/hooks/useDogs';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { DogCard } from '@/components/dogs/DogCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Pencil, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { DogForm } from '@/components/dogs/DogForm';

export default function DogDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { getDogById, updateDog, deleteDog, updateDogStatus } = useDogs();
  const [isEditing, setIsEditing] = useState(false);
  
  const dog = getDogById(id || '');
  
  if (!dog) {
    return (
      <div className="container mx-auto py-8">
        <p>Dog not found</p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Go back
        </Button>
      </div>
    );
  }

  const handleUpdate = async (data: any) => {
    try {
      updateDog(dog.id, data);
      toast({
        title: 'Success',
        description: 'Dog information updated successfully',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating dog:', error);
      toast({
        title: 'Error',
        description: 'Failed to update dog information',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this dog?')) {
      deleteDog(dog.id);
      toast({
        title: 'Success',
        description: 'Dog deleted successfully',
      });
      navigate('/dashboard');
    }
  };

  const handleStatusUpdate = (status: 'approved' | 'rejected') => {
    if (window.confirm(`Are you sure you want to ${status} this dog's registration?`)) {
      updateDogStatus(dog.id, status);
      toast({
        title: 'Success',
        description: `Dog registration ${status} successfully`,
      });
    }
  };

  if (isEditing) {
    return (
      <div className="container mx-auto py-8">
        <Button 
          variant="outline" 
          onClick={() => setIsEditing(false)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to details
        </Button>
        <h1 className="text-2xl font-bold mb-6">Edit Dog Information</h1>
        <DogForm 
          initialData={dog} 
          onSubmit={handleUpdate} 
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        
        {user?.role === 'owner' && (
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="w-4 h-4 mr-2" /> Edit
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          </div>
        )}

        {user?.role === 'admin' && dog.status === 'pending' && (
          <div className="space-x-2">
            <Button 
              variant="default"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleStatusUpdate('approved')}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
            </Button>
            <Button 
              variant="destructive"
              onClick={() => handleStatusUpdate('rejected')}
            >
              <XCircle className="w-4 h-4 mr-2" /> Reject
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <DogCard dog={dog} showActions={false} />
          
          {user?.role === 'vet' && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Veterinarian Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => navigate(`/dogs/${dog.id}/health`)}>
                  Update Health Records
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Owner Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Owner Name</p>
                  <p className="font-medium">{dog.ownerName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact Email</p>
                  <p className="font-medium">{dog.ownerEmail || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{dog.ownerPhone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{dog.ownerAddress || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Health Records</CardTitle>
                {(user?.role === 'vet' || user?.role === 'admin') && (
                  <Button 
                    size="sm"
                    onClick={() => navigate(`/dogs/${dog.id}/health/new`)}
                  >
                    Add Record
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {dog.healthRecords?.length ? (
                <div className="space-y-4">
                  {dog.healthRecords.map((record, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{record.vaccinationName}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(record.vaccinationDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {record.updatedByRole}
                        </Badge>
                      </div>
                      {record.notes && (
                        <p className="mt-2 text-sm">{record.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No health records found</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

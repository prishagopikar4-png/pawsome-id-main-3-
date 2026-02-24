import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDogs } from '@/hooks/useDogs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

const HealthUpdate = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getDogById, updateDogHealth } = useDogs();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [dog, setDog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    vaccinationName: '',
    vaccinationDate: format(new Date(), 'yyyy-MM-dd'),
    notes: ''
  });

  useEffect(() => {
    const loadDog = async () => {
      if (!id) {
        navigate('/dashboard');
        return;
      }
      
      try {
        const dogData = getDogById(id);
        if (!dogData) {
          throw new Error('Dog not found');
        }
        setDog(dogData);
      } catch (error) {
        console.error('Error loading dog:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dog information',
          variant: 'destructive'
        });
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDog();
  }, [id, navigate, toast, getDogById]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dog || !user) return;

    try {
      const healthRecord = {
        ...formData,
        updatedBy: user.name,
        updatedByRole: user.role,
        updatedAt: new Date().toISOString()
      };

      await updateDogHealth(dog.id, healthRecord);
      
      toast({
        title: 'Success',
        description: 'Health record updated successfully',
      });
      
      // Redirect to dog detail page
      navigate(`/dogs/${dog.id}`);
    } catch (error) {
      console.error('Error updating health record:', error);
      toast({
        title: 'Error',
        description: 'Failed to update health record',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  if (!dog) {
    return <div className="container mx-auto py-8">Dog not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Update Health Record</h1>
      <h2 className="text-xl font-semibold mb-4">{dog.name} - {dog.breed}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vaccinationName">Vaccination / Treatment</Label>
            <Input
              id="vaccinationName"
              name="vaccinationName"
              value={formData.vaccinationName}
              onChange={handleChange}
              required
              placeholder="e.g., Rabies, Flea Treatment, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vaccinationDate">Date</Label>
            <Input
              id="vaccinationDate"
              name="vaccinationDate"
              type="date"
              value={formData.vaccinationDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Any additional notes about this health update..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button type="submit">
            Save Health Record
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HealthUpdate;
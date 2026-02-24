import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDogs } from '@/hooks/useDogs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

export default function RegisterDog() {
  const { user } = useAuth();
  const { registerDog } = useDogs();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: 0,
    gender: 'male',
    color: '',
    photo: '',
    implantDate: '',
    implantLocation: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to register a dog',
        variant: 'destructive'
      });
      return;
    }

    try {
      await registerDog({
        ...formData,
        ownerId: user.id,
        ownerName: user.name,
        ownerEmail: user.email,
        ownerPhone: user.phone,
        ownerAddress: user.address
      });
      
      toast({
        title: 'Success',
        description: 'Dog registration submitted for approval',
      });
      
      // Redirect to dashboard after successful submission
      navigate('/dashboard');
    } catch (error) {
      console.error('Error registering dog:', error);
      toast({
        title: 'Error',
        description: 'Failed to register dog. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Register Your Dog</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dog's Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Dog's Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter dog's name"
            />
          </div>

          {/* Breed */}
          <div className="space-y-2">
            <Label htmlFor="breed">Breed *</Label>
            <Input
              id="breed"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              required
              placeholder="Enter breed"
            />
          </div>

          {/* Age */}
          <div className="space-y-2">
            <Label htmlFor="age">Age (years) *</Label>
            <Input
              id="age"
              name="age"
              type="number"
              min="0"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label>Gender *</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleSelectChange('gender', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label htmlFor="color">Color *</Label>
            <Input
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              required
              placeholder="Enter color"
            />
          </div>

          {/* Photo URL */}
          <div className="space-y-2">
            <Label htmlFor="photo">Photo URL</Label>
            <Input
              id="photo"
              name="photo"
              type="url"
              value={formData.photo}
              onChange={handleChange}
              placeholder="https://example.com/dog.jpg"
            />
          </div>

          {/* Implant Date */}
          <div className="space-y-2">
            <Label htmlFor="implantDate">Implant Date *</Label>
            <Input
              id="implantDate"
              name="implantDate"
              type="date"
              value={formData.implantDate}
              onChange={handleChange}
              required
            />
          </div>

          {/* Implant Location */}
          <div className="space-y-2">
            <Label htmlFor="implantLocation">Implant Location *</Label>
            <Input
              id="implantLocation"
              name="implantLocation"
              value={formData.implantLocation}
              onChange={handleChange}
              required
              placeholder="e.g., Shoulder, Neck"
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
            Register Dog
          </Button>
        </div>
      </form>
    </div>
  );
}

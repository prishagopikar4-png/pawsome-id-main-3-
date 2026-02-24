import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';

const dogFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  breed: z.string().min(2, 'Breed is required'),
  age: z.number().min(0, 'Age must be a positive number'),
  gender: z.enum(['male', 'female']),
  color: z.string().min(2, 'Color is required'),
  photo: z.string().url('Please enter a valid URL'),
  chipId: z.string().min(5, 'Chip ID is required'),
  implantDate: z.string().min(1, 'Implant date is required'),
  implantLocation: z.string().min(2, 'Implant location is required'),
});

type DogFormValues = z.infer<typeof dogFormSchema>;

interface DogFormProps {
  initialData?: DogFormValues;
  onSubmit: (data: DogFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function DogForm({ initialData, onSubmit, isSubmitting = false }: DogFormProps) {
  const { toast } = useToast();
  
  const form = useForm<DogFormValues>({
    resolver: zodResolver(dogFormSchema),
    defaultValues: initialData || {
      name: '',
      breed: '',
      age: 0,
      gender: 'male',
      color: '',
      photo: '',
      chipId: '',
      implantDate: '',
      implantLocation: '',
    },
  });

  const handleSubmit = async (data: DogFormValues) => {
    try {
      await onSubmit(data);
      toast({
        title: 'Success',
        description: initialData ? 'Dog updated successfully' : 'Dog registered successfully',
      });
    } catch (error) {
      console.error('Error submitting dog form:', error);
      toast({
        title: 'Error',
        description: 'Failed to save dog information. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dog's Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter dog's name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Breed */}
          <FormField
            control={form.control}
            name="breed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Breed</FormLabel>
                <FormControl>
                  <Input placeholder="Enter breed" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Age */}
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age (years)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Gender */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Color */}
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Input placeholder="Enter color" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Photo URL */}
          <FormField
            control={form.control}
            name="photo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Photo URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/dog.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Chip ID */}
          <FormField
            control={form.control}
            name="chipId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chip ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter chip ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Implant Date */}
          <FormField
            control={form.control}
            name="implantDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Implant Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Implant Location */}
          <FormField
            control={form.control}
            name="implantLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Implant Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Shoulder, Neck" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Dog'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

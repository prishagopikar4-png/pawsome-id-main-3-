import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dog } from '@/types';
import { Link } from 'react-router-dom';

interface DogCardProps {
  dog: Dog;
  showActions?: boolean;
  onEdit?: (dog: Dog) => void;
  onDelete?: (id: string) => void;
}

export function DogCard({ dog, showActions = true, onEdit, onDelete }: DogCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{dog.name}</CardTitle>
            <CardDescription className="mt-1">{dog.breed}, {dog.age} years</CardDescription>
          </div>
          <Badge 
            variant={dog.status === 'approved' ? 'default' : dog.status === 'pending' ? 'secondary' : 'destructive'}
            className="capitalize"
          >
            {dog.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="aspect-video bg-muted rounded-md overflow-hidden">
            {dog.photo ? (
              <img 
                src={dog.photo} 
                alt={dog.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted-foreground/10">
                <span className="text-muted-foreground">No image available</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Chip ID</p>
              <p className="font-medium">{dog.chipId || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Gender</p>
              <p className="font-medium capitalize">{dog.gender}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Color</p>
              <p className="font-medium capitalize">{dog.color}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Implant Date</p>
              <p className="font-medium">{new Date(dog.implantDate).toLocaleDateString()}</p>
            </div>
            <div className="space-y-1 col-span-2">
              <p className="text-muted-foreground">Implant Location</p>
              <p className="font-medium">{dog.implantLocation}</p>
            </div>
          </div>
        </div>
      </CardContent>
      {showActions && (
        <CardFooter className="flex justify-between">
          <Button asChild variant="outline" size="sm">
            <Link to={`/dogs/${dog.id}`}>View Details</Link>
          </Button>
          <div className="space-x-2">
            {onEdit && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit(dog)}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => dog.id && onDelete(dog.id)}
              >
                Delete
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

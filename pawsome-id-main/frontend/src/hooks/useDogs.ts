import { Dog } from '@/types';
import { getDogs, saveDogs, generateId, generateChipId } from '@/lib/storage';

export function useDogs() {
  const getAllDogs = (): Dog[] => {
    return getDogs();
  };

  const getDogsByOwner = (ownerId: string): Dog[] => {
    return getDogs().filter(d => d.ownerId === ownerId);
  };

  const getDogByChip = (chipId: string): Dog | undefined => {
    return getDogs().find(d => d.chipId.toLowerCase() === chipId.toLowerCase());
  };

  const getDogById = (dogId: string): Dog | undefined => {
    return getDogs().find(d => d.id === dogId);
  };

  const registerDog = (dogData: Omit<Dog, 'id' | 'chipId' | 'status' | 'createdAt'>): Dog => {
    const dogs = getDogs();
    const newDog: Dog = {
      ...dogData,
      id: generateId('dog'),
      chipId: generateChipId(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    dogs.push(newDog);
    saveDogs(dogs);
    return newDog;
  };

  const updateDogStatus = (dogId: string, status: Dog['status']): boolean => {
    const dogs = getDogs();
    const index = dogs.findIndex(d => d.id === dogId);
    if (index === -1) return false;
    
    dogs[index].status = status;
    saveDogs(dogs);
    return true;
  };

  const updateDog = (dogId: string, updates: Partial<Dog>): boolean => {
    const dogs = getDogs();
    const index = dogs.findIndex(d => d.id === dogId);
    if (index === -1) return false;
    
    dogs[index] = { ...dogs[index], ...updates };
    saveDogs(dogs);
    return true;
  };

  const deleteDog = (dogId: string): boolean => {
    const dogs = getDogs();
    const initialLength = dogs.length;
    const updatedDogs = dogs.filter(dog => dog.id !== dogId);
    
    if (updatedDogs.length < initialLength) {
      saveDogs(updatedDogs);
      return true;
    }
    return false;
  };

  return {
    getAllDogs,
    getDogsByOwner,
    getDogByChip,
    getDogById,
    registerDog,
    updateDogStatus,
    updateDog,
    deleteDog
  };
}

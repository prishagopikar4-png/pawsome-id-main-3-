import { User, Dog, HealthRecord } from '@/types';

// Mock Users Database
export const mockUsers: (User & { password: string })[] = [
  {
    id: 'user-1',
    name: 'John Smith',
    email: 'owner@demo.com',
    password: 'demo123',
    phone: '+1-555-0101',
    address: '123 Pet Lane, Springfield, IL 62701',
    role: 'owner',
    verified: true,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'user-2',
    name: 'Dr. Sarah Johnson',
    email: 'vet@demo.com',
    password: 'demo123',
    phone: '+1-555-0102',
    address: 'Pet Care Clinic, 456 Vet Street, Springfield, IL 62702',
    role: 'vet',
    verified: true,
    createdAt: '2024-01-10T10:00:00Z'
  },
  {
    id: 'user-3',
    name: 'Springfield Animal Shelter',
    email: 'shelter@demo.com',
    password: 'demo123',
    phone: '+1-555-0103',
    address: '789 Shelter Road, Springfield, IL 62703',
    role: 'shelter',
    verified: true,
    createdAt: '2024-01-05T10:00:00Z'
  },
  {
    id: 'user-4',
    name: 'Admin User',
    email: 'admin@demo.com',
    password: 'demo123',
    phone: '+1-555-0100',
    address: 'Admin Office, Springfield, IL 62700',
    role: 'admin',
    verified: true,
    createdAt: '2024-01-01T10:00:00Z'
  }
];

// Mock Dogs Database
export const mockDogs: Dog[] = [
  {
    id: 'dog-1',
    chipId: 'CHIP-2024-001234',
    name: 'Buddy',
    breed: 'Golden Retriever',
    age: 3,
    gender: 'male',
    color: 'Golden',
    photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400',
    ownerId: 'user-1',
    implantDate: '2024-02-15',
    implantLocation: 'Pet Care Clinic, Springfield',
    status: 'approved',
    createdAt: '2024-02-15T14:30:00Z'
  },
  {
    id: 'dog-2',
    chipId: 'CHIP-2024-005678',
    name: 'Luna',
    breed: 'German Shepherd',
    age: 2,
    gender: 'female',
    color: 'Black and Tan',
    photo: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400',
    ownerId: 'user-1',
    implantDate: '2024-03-20',
    implantLocation: 'City Vet Hospital',
    status: 'pending',
    createdAt: '2024-03-20T09:15:00Z'
  },
  {
    id: 'dog-3',
    chipId: 'CHIP-2024-009012',
    name: 'Max',
    breed: 'Labrador Retriever',
    age: 5,
    gender: 'male',
    color: 'Black',
    photo: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    ownerId: 'user-1',
    implantDate: '2024-01-10',
    implantLocation: 'Pet Care Clinic, Springfield',
    status: 'approved',
    createdAt: '2024-01-10T11:00:00Z'
  }
];

// Mock Health Records
export const mockHealthRecords: HealthRecord[] = [
  {
    id: 'health-1',
    dogId: 'dog-1',
    vaccinationName: 'Rabies',
    vaccinationDate: '2024-02-15',
    notes: 'Annual rabies vaccination administered. Dog in good health.',
    updatedBy: 'user-2',
    createdAt: '2024-02-15T15:00:00Z'
  },
  {
    id: 'health-2',
    dogId: 'dog-1',
    vaccinationName: 'DHPP',
    vaccinationDate: '2024-02-15',
    notes: 'Distemper, Hepatitis, Parainfluenza, Parvovirus combination vaccine.',
    updatedBy: 'user-2',
    createdAt: '2024-02-15T15:05:00Z'
  },
  {
    id: 'health-3',
    dogId: 'dog-3',
    vaccinationName: 'Rabies',
    vaccinationDate: '2024-01-10',
    notes: 'Rabies booster administered.',
    updatedBy: 'user-2',
    createdAt: '2024-01-10T12:00:00Z'
  }
];

// LocalStorage keys
const STORAGE_KEYS = {
  USERS: 'dogchip_users',
  DOGS: 'dogchip_dogs',
  HEALTH_RECORDS: 'dogchip_health_records',
  CURRENT_USER: 'dogchip_current_user',
  PENDING_OTP: 'dogchip_pending_otp'
};

// Initialize localStorage with mock data if empty
export function initializeStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DOGS)) {
    localStorage.setItem(STORAGE_KEYS.DOGS, JSON.stringify(mockDogs));
  }
  if (!localStorage.getItem(STORAGE_KEYS.HEALTH_RECORDS)) {
    localStorage.setItem(STORAGE_KEYS.HEALTH_RECORDS, JSON.stringify(mockHealthRecords));
  }
}

// User operations
export function getUsers(): (User & { password: string })[] {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
}

export function saveUsers(users: (User & { password: string })[]) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function getCurrentUser(): User | null {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
}

export function setCurrentUser(user: User | null) {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

// Dog operations
export function getDogs(): Dog[] {
  const data = localStorage.getItem(STORAGE_KEYS.DOGS);
  return data ? JSON.parse(data) : [];
}

export function saveDogs(dogs: Dog[]) {
  localStorage.setItem(STORAGE_KEYS.DOGS, JSON.stringify(dogs));
}

export function getDogByChipId(chipId: string): Dog | undefined {
  const dogs = getDogs();
  return dogs.find(d => d.chipId.toLowerCase() === chipId.toLowerCase());
}

export function getDogsByOwnerId(ownerId: string): Dog[] {
  const dogs = getDogs();
  return dogs.filter(d => d.ownerId === ownerId);
}

// Health record operations
export function getHealthRecords(): HealthRecord[] {
  const data = localStorage.getItem(STORAGE_KEYS.HEALTH_RECORDS);
  return data ? JSON.parse(data) : [];
}

export function saveHealthRecords(records: HealthRecord[]) {
  localStorage.setItem(STORAGE_KEYS.HEALTH_RECORDS, JSON.stringify(records));
}

export function getHealthRecordsByDogId(dogId: string): HealthRecord[] {
  const records = getHealthRecords();
  return records.filter(r => r.dogId === dogId);
}

// OTP operations (mock)
export function setPendingOtp(email: string, otp: string) {
  localStorage.setItem(STORAGE_KEYS.PENDING_OTP, JSON.stringify({ email, otp, expires: Date.now() + 300000 }));
}

export function getPendingOtp(): { email: string; otp: string; expires: number } | null {
  const data = localStorage.getItem(STORAGE_KEYS.PENDING_OTP);
  return data ? JSON.parse(data) : null;
}

export function clearPendingOtp() {
  localStorage.removeItem(STORAGE_KEYS.PENDING_OTP);
}

// Generate unique IDs
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateChipId(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(100000 + Math.random() * 900000);
  return `CHIP-${year}-${num}`;
}

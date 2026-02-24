export type UserRole = 'owner' | 'vet' | 'shelter' | 'admin';

export type ChipStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: UserRole;
  verified: boolean;
  createdAt: string;
}

export interface HealthRecord {
  id: string;
  dogId: string;
  vaccinationName: string;
  vaccinationDate: string;
  notes: string;
  updatedBy: string;
  updatedByRole: UserRole;
  createdAt: string;
}

export interface Dog {
  id: string;
  chipId: string;
  breed: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  color: string;
  photo: string;
  ownerId: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  ownerAddress?: string;
  implantDate: string;
  implantLocation: string;
  status: ChipStatus;
  healthRecords?: HealthRecord[];
  createdAt: string;
}

export interface HealthRecord {
  id: string;
  dogId: string;
  vaccinationName: string;
  vaccinationDate: string;
  notes: string;
  updatedBy: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: Omit<User, 'id' | 'createdAt' | 'verified'> & { password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  verifyOtp: (otp: string) => Promise<boolean>;
}

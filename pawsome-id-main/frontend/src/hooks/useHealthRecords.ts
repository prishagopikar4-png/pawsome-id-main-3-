import { HealthRecord } from '@/types';
import { getHealthRecords, saveHealthRecords, generateId } from '@/lib/storage';

export function useHealthRecords() {
  const getRecordsByDog = (dogId: string): HealthRecord[] => {
    return getHealthRecords().filter(r => r.dogId === dogId);
  };

  const addHealthRecord = (recordData: Omit<HealthRecord, 'id' | 'createdAt'>): HealthRecord => {
    const records = getHealthRecords();
    const newRecord: HealthRecord = {
      ...recordData,
      id: generateId('health'),
      createdAt: new Date().toISOString()
    };
    records.push(newRecord);
    saveHealthRecords(records);
    return newRecord;
  };

  const getAllRecords = (): HealthRecord[] => {
    return getHealthRecords();
  };

  return {
    getRecordsByDog,
    addHealthRecord,
    getAllRecords
  };
}

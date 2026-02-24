import mongoose from 'mongoose';

const HealthRecordSchema = new mongoose.Schema({
  dogId: { type: String, required: true, index: true },
  vaccinationName: { type: String, required: true },
  vaccinationDate: { type: String, required: true },
  notes: { type: String, required: true },
  updatedBy: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('HealthRecord', HealthRecordSchema);

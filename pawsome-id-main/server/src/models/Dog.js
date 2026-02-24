import mongoose from 'mongoose';

const DogSchema = new mongoose.Schema({
  name: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  color: { type: String, required: true },
  photo: { type: String, required: true },
  chipId: { type: String, required: true, unique: true, index: true },
  ownerId: { type: String, required: true },
  implantDate: { type: String, required: true },
  implantLocation: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model('Dog', DogSchema);

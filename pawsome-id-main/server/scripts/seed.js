import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';
import Dog from '../src/models/Dog.js';
import HealthRecord from '../src/models/HealthRecord.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pawsome';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB for seeding');

    // Clear existing data (only in development)
    await User.deleteMany({});
    await Dog.deleteMany({});
    await HealthRecord.deleteMany({});

    const password = await bcrypt.hash('password', 10);
    const owner = await User.create({
      name: 'Jane Owner',
      email: 'owner@example.com',
      password,
      phone: '555-0101',
      address: '123 Pet Lane',
      role: 'owner',
      verified: true
    });

    const dog = await Dog.create({
      name: 'Buddy',
      breed: 'Labrador',
      age: 3,
      gender: 'male',
      color: 'yellow',
      photo: 'https://example.com/dog.jpg',
      chipId: 'CHIP-2026-571307',
      ownerId: owner._id.toString(),
      implantDate: '2026-02-01',
      implantLocation: 'Shoulder',
      status: 'approved'
    });

    await HealthRecord.create({
      dogId: dog._id.toString(),
      vaccinationName: 'Rabies',
      vaccinationDate: '2026-02-10',
      notes: 'Up to date',
      updatedBy: owner._id.toString()
    });

    console.log('Seeding complete');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();

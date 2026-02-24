import express from 'express';
import Dog from '../models/Dog.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all dogs or search by name
router.get('/', async (req, res) => {
  try {
    const q = req.query.q;
    const filter = {};
    if (q) filter.name = new RegExp(q, 'i');
    const dogs = await Dog.find(filter);
    res.json(dogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dogs by owner
router.get('/owner/:ownerId', async (req, res) => {
  try {
    const dogs = await Dog.find({ ownerId: req.params.ownerId });
    res.json(dogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Lookup dog by chip ID
router.get('/chip/:chipId', async (req, res) => {
  try {
    const { chipId } = req.params;
    const dog = await Dog.findOne({ chipId });
    if (!dog) return res.status(404).json({ message: 'Dog not found' });
    res.json(dog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single dog by ID
router.get('/:id', async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id);
    if (!dog) return res.status(404).json({ message: 'Dog not found' });
    res.json(dog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register new dog (requires auth)
router.post('/', auth, async (req, res) => {
  try {
    const { name, breed, age, gender, color, photo, chipId, implantDate, implantLocation } = req.body;
    
    if (!name || !breed || !age || !gender || !color || !photo || !chipId || !implantDate || !implantLocation) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if chip ID already exists
    const existing = await Dog.findOne({ chipId });
    if (existing) return res.status(400).json({ message: 'Chip ID already registered' });

    const dog = await Dog.create({
      name,
      breed,
      age,
      gender,
      color,
      photo,
      chipId,
      ownerId: req.user.id,
      implantDate,
      implantLocation,
      status: 'pending'
    });

    res.status(201).json(dog);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Bad request' });
  }
});

// Update dog (requires auth)
router.put('/:id', auth, async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id);
    if (!dog) return res.status(404).json({ message: 'Dog not found' });

    // Check authorization (owner or admin)
    if (dog.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Dog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Bad request' });
  }
});

// Approve/reject dog registration (admin only)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Check authorization (admin)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }

    const dog = await Dog.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(dog);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Bad request' });
  }
});

// Delete dog (owner or admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const dog = await Dog.findById(req.params.id);
    if (!dog) return res.status(404).json({ message: 'Dog not found' });

    if (dog.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Dog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Dog deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

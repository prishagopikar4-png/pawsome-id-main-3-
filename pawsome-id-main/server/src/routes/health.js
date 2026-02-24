import express from 'express';
import HealthRecord from '../models/HealthRecord.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get health records for a dog
router.get('/:dogId/health', async (req, res) => {
  try {
    const records = await HealthRecord.find({ dogId: req.params.dogId }).sort('-createdAt');
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add health record (vet only)
router.post('/:dogId/health', auth, async (req, res) => {
  try {
    if (req.user.role !== 'vet' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only vets can add health records' });
    }

    const { vaccinationName, vaccinationDate, notes } = req.body;
    if (!vaccinationName || !vaccinationDate || !notes) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const record = await HealthRecord.create({
      dogId: req.params.dogId,
      vaccinationName,
      vaccinationDate,
      notes,
      updatedBy: req.user.id
    });

    res.status(201).json(record);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Bad request' });
  }
});

// Update health record (vet only)
router.put('/:dogId/health/:recordId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'vet' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only vets can update health records' });
    }

    const record = await HealthRecord.findByIdAndUpdate(
      req.params.recordId,
      { ...req.body, updatedBy: req.user.id },
      { new: true }
    );

    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Bad request' });
  }
});

// Delete health record (vet only)
router.delete('/:dogId/health/:recordId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'vet' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only vets can delete health records' });
    }

    await HealthRecord.findByIdAndDelete(req.params.recordId);
    res.json({ message: 'Record deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

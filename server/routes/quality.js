import express from 'express';
import QualityRecord from '../models/QualityRecord.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all quality records
router.get('/', authMiddleware, async (req, res) => {
  try {
    const records = await QualityRecord.find().sort({ testDate: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create quality record
router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER', 'QC']), async (req, res) => {
  try {
    const record = new QualityRecord(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update quality record
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER', 'QC']), async (req, res) => {
  try {
    const record = await QualityRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

import express from 'express';
import CoconutBatch from '../models/CoconutBatch.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all coconut batches
router.get('/', authMiddleware, async (req, res) => {
  try {
    const batches = await CoconutBatch.find().sort({ dateReceived: -1 });
    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new batch
router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER', 'PRODUCTION']), async (req, res) => {
  try {
    const batch = new CoconutBatch(req.body);
    await batch.save();
    res.status(201).json(batch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update batch
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER', 'PRODUCTION']), async (req, res) => {
  try {
    const batch = await CoconutBatch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(batch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

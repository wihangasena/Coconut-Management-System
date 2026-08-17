import express from 'express';
import Inventory from '../models/Inventory.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all inventory
router.get('/', authMiddleware, async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create inventory item
router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER']), async (req, res) => {
  try {
    const item = new Inventory(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update inventory item
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER']), async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

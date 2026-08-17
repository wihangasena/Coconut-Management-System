import express from 'express';
import OilBatch from '../models/OilBatch.js';
import CharcoalBatch from '../models/CharcoalBatch.js';
import ByProduct from '../models/ByProduct.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Oil Batches
router.get('/oil', authMiddleware, async (req, res) => {
  try {
    const batches = await OilBatch.find().sort({ productionDate: -1 });
    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/oil', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER', 'PRODUCTION']), async (req, res) => {
  try {
    const batch = new OilBatch(req.body);
    await batch.save();
    res.status(201).json(batch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/oil/:id/status', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER', 'PRODUCTION']), async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'Batch ID is required.' });
    }
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }
    
    const allowedStatuses = ['PROCESSING', 'QUALITY_CHECK', 'READY', 'PACKAGED'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status value. Allowed: ${allowedStatuses.join(', ')}` });
    }

    const batch = await OilBatch.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!batch) {
      return res.status(404).json({ message: `Oil batch with ID ${id} not found.` });
    }

    res.json(batch);
  } catch (error) {
    console.error('Error updating oil batch status:', error);
    res.status(500).json({ message: error.message || 'Failed to update batch status.' });
  }
});

// By-Products
router.get('/byproducts', authMiddleware, async (req, res) => {
  try {
    const byproducts = await ByProduct.find().sort({ collectionDate: -1 });
    const husks = byproducts.filter(b => b.type === 'HUSK');
    const shells = byproducts.filter(b => b.type === 'SHELL');
    const coir = byproducts.filter(b => b.type === 'COIR');
    res.json({ husks, shells, coir });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/byproducts', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER', 'PRODUCTION']), async (req, res) => {
  try {
    const byproduct = new ByProduct(req.body);
    await byproduct.save();
    res.status(201).json(byproduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Charcoal Batches
router.get('/charcoal', authMiddleware, async (req, res) => {
  try {
    const batches = await CharcoalBatch.find().sort({ productionDate: -1 });
    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/charcoal', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER', 'PRODUCTION']), async (req, res) => {
  try {
    const batch = new CharcoalBatch(req.body);
    await batch.save();
    res.status(201).json(batch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

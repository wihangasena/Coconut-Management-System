import express from 'express';
import SalesOrder from '../models/SalesOrder.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all sales orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await SalesOrder.find().sort({ orderDate: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create sales order
router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER', 'SALES']), async (req, res) => {
  try {
    const order = new SalesOrder(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update sales order
router.put('/:id', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER', 'SALES']), async (req, res) => {
  try {
    const order = await SalesOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

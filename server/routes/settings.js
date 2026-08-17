import express from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get settings
router.get('/', authMiddleware, roleMiddleware(['ADMIN', 'MANAGER']), async (req, res) => {
  try {
    const settings = {
      companyName: 'Coconut Processing Unit',
      companyAddress: 'Sri Lanka',
      currency: 'LKR',
      dateFormat: 'YYYY-MM-DD',
      timezone: 'Asia/Colombo',
    };
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

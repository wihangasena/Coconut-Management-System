import express from 'express';
import OilBatch from '../models/OilBatch.js';
import CharcoalBatch from '../models/CharcoalBatch.js';
import ByProduct from '../models/ByProduct.js';
import SalesOrder from '../models/SalesOrder.js';
import QualityRecord from '../models/QualityRecord.js';
import Inventory from '../models/Inventory.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/kpis', authMiddleware, async (req, res) => {
  try {
    const totalRevenueLkr = await SalesOrder.aggregate([
      { $group: { _id: null, total: { $sum: '$totalLkr' } } }
    ]);

    const totalOilYieldLiters = await OilBatch.aggregate([
      { $group: { _id: null, total: { $sum: '$yieldLiters' } } }
    ]);

    const charcoalYieldKg = await CharcoalBatch.aggregate([
      { $group: { _id: null, total: { $sum: '$yieldKg' } } }
    ]);

    const qcRecords = await QualityRecord.find();
    const qcFailed = qcRecords.filter(r => !r.passed).length;
    const qcFailureRate = qcRecords.length === 0 ? 0 : qcFailed / qcRecords.length;

    const huskRecoveredKg = await ByProduct.aggregate([
      { $match: { type: 'HUSK' } },
      { $group: { _id: null, total: { $sum: '$weightKg' } } }
    ]);

    const shellsRecoveredKg = await ByProduct.aggregate([
      { $match: { type: 'SHELL' } },
      { $group: { _id: null, total: { $sum: '$weightKg' } } }
    ]);

    const recentOilBatches = await OilBatch.find()
      .sort({ productionDate: -1, createdAt: -1 })
      .limit(5)
      .select('batchId productionDate yieldLiters status coconutBatchId');

    const recentCharcoalBatches = await CharcoalBatch.find()
      .sort({ productionDate: -1, createdAt: -1 })
      .limit(5)
      .select('batchId productionDate yieldKg status byProductId');

    res.json({
      totalRevenueLkr: totalRevenueLkr[0]?.total || 0,
      totalOilYieldLiters: totalOilYieldLiters[0]?.total || 0,
      charcoalYieldKg: charcoalYieldKg[0]?.total || 0,
      qcFailureRate,
      circular: {
        huskRecoveredKg: huskRecoveredKg[0]?.total || 0,
        shellsRecoveredKg: shellsRecoveredKg[0]?.total || 0,
      },
      recentOilBatches: recentOilBatches.map((batch) => ({
        id: batch._id,
        batchId: batch.batchId,
        productionDate: batch.productionDate,
        yieldLiters: batch.yieldLiters || 0,
        status: batch.status,
        coconutBatchId: batch.coconutBatchId,
      })),
      recentCharcoalBatches: recentCharcoalBatches.map((batch) => ({
        id: batch._id,
        batchId: batch.batchId,
        productionDate: batch.productionDate,
        yieldKg: batch.yieldKg || 0,
        status: batch.status,
        byProductId: batch.byProductId,
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

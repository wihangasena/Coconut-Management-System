import mongoose from 'mongoose';

const charcoalBatchSchema = new mongoose.Schema(
  {
    batchId: String,
    byProductId: mongoose.Schema.Types.ObjectId,
    productionDate: Date,
    feedstockKg: Number,
    yieldKg: Number,
    conversionRate: Number,
    carbonContent: Number,
    ashContent: Number,
    status: { type: String, enum: ['PRODUCTION', 'COOLING', 'READY', 'PACKAGED'], default: 'PRODUCTION' },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model('CharcoalBatch', charcoalBatchSchema);

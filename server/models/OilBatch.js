import mongoose from 'mongoose';

const oilBatchSchema = new mongoose.Schema(
  {
    batchId: String,
    coconutBatchId: mongoose.Schema.Types.ObjectId,
    productionDate: Date,
    yieldLiters: Number,
    oilQuality: String,
    acidValue: Number,
    moisture: Number,
    impurities: Number,
    processingNotes: String,
    status: { type: String, enum: ['PROCESSING', 'QUALITY_CHECK', 'READY', 'PACKAGED'], default: 'PROCESSING' },
  },
  { timestamps: true }
);

export default mongoose.model('OilBatch', oilBatchSchema);

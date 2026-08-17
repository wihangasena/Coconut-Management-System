import mongoose from 'mongoose';

const coconutBatchSchema = new mongoose.Schema(
  {
    batchId: String,
    supplierId: mongoose.Schema.Types.ObjectId,
    supplierName: String,
    dateReceived: Date,
    quantityCoconuts: Number,
    weightKg: Number,
    quality: String,
    moistureLevel: Number,
    notes: String,
    status: { type: String, enum: ['RECEIVED', 'PROCESSING', 'COMPLETED'], default: 'RECEIVED' },
  },
  { timestamps: true }
);

export default mongoose.model('CoconutBatch', coconutBatchSchema);

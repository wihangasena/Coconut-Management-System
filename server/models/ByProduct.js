import mongoose from 'mongoose';

const byProductSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['HUSK', 'SHELL', 'COIR'], required: true },
    coconutBatchId: mongoose.Schema.Types.ObjectId,
    oilBatchId: mongoose.Schema.Types.ObjectId,
    weightKg: Number,
    quality: String,
    collectionDate: Date,
    storageLocation: String,
    status: { type: String, enum: ['COLLECTED', 'STORED', 'SHIPPED'], default: 'COLLECTED' },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model('ByProduct', byProductSchema);

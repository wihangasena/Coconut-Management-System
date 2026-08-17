import mongoose from 'mongoose';

const qualityRecordSchema = new mongoose.Schema(
  {
    batchId: String,
    batchType: { type: String, enum: ['OIL', 'CHARCOAL', 'BYPRODUCT'], required: true },
    testDate: Date,
    testerName: String,
    parameters: {
      moisturePercentage: Number,
      acidValue: Number,
      impurityPercentage: Number,
      colorRating: String,
      odor: String,
    },
    passed: { type: Boolean, required: true },
    remarks: String,
    nextTestDate: Date,
  },
  { timestamps: true }
);

export default mongoose.model('QualityRecord', qualityRecordSchema);

import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    productId: String,
    productName: String,
    category: { type: String, enum: ['OIL', 'CHARCOAL', 'BYPRODUCT', 'PACKAGING'], required: true },
    quantityOnHand: Number,
    reorderLevel: Number,
    reorderQuantity: Number,
    unit: String,
    location: String,
    batch: String,
    expiryDate: Date,
    status: { type: String, enum: ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'], default: 'IN_STOCK' },
  },
  { timestamps: true }
);

export default mongoose.model('Inventory', inventorySchema);

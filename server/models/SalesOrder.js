import mongoose from 'mongoose';

const salesOrderSchema = new mongoose.Schema(
  {
    orderId: String,
    customerId: mongoose.Schema.Types.ObjectId,
    customerName: String,
    orderDate: Date,
    deliveryDate: Date,
    status: { type: String, enum: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'], default: 'PENDING' },
    items: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        productName: String,
        quantity: Number,
        unitPrice: Number,
        totalPrice: Number,
      }
    ],
    totalLkr: Number,
    paymentStatus: { type: String, enum: ['PENDING', 'PARTIAL', 'PAID'], default: 'PENDING' },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model('SalesOrder', salesOrderSchema);

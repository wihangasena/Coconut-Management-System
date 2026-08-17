import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import CoconutBatch from './models/CoconutBatch.js';
import OilBatch from './models/OilBatch.js';
import CharcoalBatch from './models/CharcoalBatch.js';
import ByProduct from './models/ByProduct.js';
import Inventory from './models/Inventory.js';
import SalesOrder from './models/SalesOrder.js';
import QualityRecord from './models/QualityRecord.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ MongoDB connected');

    // Clear existing data (optional - comment out to keep data)
    await User.deleteMany({});
    await CoconutBatch.deleteMany({});
    await OilBatch.deleteMany({});
    await CharcoalBatch.deleteMany({});
    await ByProduct.deleteMany({});
    await Inventory.deleteMany({});
    await SalesOrder.deleteMany({});
    await QualityRecord.deleteMany({});
    console.log('✓ Cleared existing data');

    // Create users with different roles
    const users = await User.insertMany([
      {
        username: 'admin',
        email: 'admin@coconut.com',
        password: 'Admin@123',
        fullName: 'Admin User',
        role: 'ADMIN'
      },
      {
        username: 'manager',
        email: 'manager@coconut.com',
        password: 'Manager@123',
        fullName: 'Manager User',
        role: 'MANAGER'
      },
      {
        username: 'production',
        email: 'production@coconut.com',
        password: 'Prod@123',
        fullName: 'Production Officer',
        role: 'PRODUCTION'
      },
      {
        username: 'qc',
        email: 'qc@coconut.com',
        password: 'QC@123',
        fullName: 'Quality Control Officer',
        role: 'QC'
      },
      {
        username: 'sales',
        email: 'sales@coconut.com',
        password: 'Sales@123',
        fullName: 'Sales Representative',
        role: 'SALES'
      },
      {
        username: 'delivery',
        email: 'delivery@coconut.com',
        password: 'Delivery@123',
        fullName: 'Delivery Officer',
        role: 'DELIVERY'
      }
    ]);
    console.log('✓ Created 6 users with different roles');

    // Create coconut batches
    const coconutBatches = await CoconutBatch.insertMany([
      {
        batchId: 'CB-001-2026',
        supplierName: 'Coconut Suppliers Ltd',
        weightKg: 5000,
        quality: 'A',
        status: 'COMPLETED',
        dateReceived: new Date(2026, 0, 8),
        quantityCoconuts: 5000,
        moistureLevel: 12.5,
        notes: 'Fresh coconuts from January harvest'
      },
      {
        batchId: 'CB-002-2026',
        supplierName: 'Premium Coconut Farm',
        weightKg: 3500,
        quality: 'A',
        status: 'PROCESSING',
        dateReceived: new Date(2026, 0, 9),
        quantityCoconuts: 3500,
        moistureLevel: 11.8,
        notes: 'Quality A grade coconuts'
      },
      {
        batchId: 'CB-003-2026',
        supplierName: 'Coastal Coconut Plantation',
        weightKg: 4200,
        quality: 'B',
        status: 'RECEIVED',
        dateReceived: new Date(2026, 0, 10),
        quantityCoconuts: 4200,
        moistureLevel: 13.2,
        notes: 'Awaiting quality inspection'
      },
      {
        batchId: 'CB-004-2026',
        supplierName: 'Coconut Suppliers Ltd',
        weightKg: 6000,
        quality: 'A',
        status: 'COMPLETED',
        dateReceived: new Date(2026, 0, 11),
        quantityCoconuts: 6000,
        moistureLevel: 12.1,
        notes: 'Large batch successfully processed'
      }
    ]);
    console.log('✓ Created 4 coconut batches');

    // Create oil batches
    const oilBatches = await OilBatch.insertMany([
      {
        batchId: 'OB-001-2026',
        coconutBatchId: coconutBatches[0]._id,
        yieldLiters: 4500,
        acidValue: 0.35,
        moisture: 0.12,
        status: 'READY',
        productionDate: new Date(2026, 0, 8),
        oilQuality: 'Premium',
        impurities: 0.05,
        processingNotes: 'High yield oil extraction'
      },
      {
        batchId: 'OB-002-2026',
        coconutBatchId: coconutBatches[1]._id,
        yieldLiters: 3200,
        acidValue: 0.28,
        moisture: 0.10,
        status: 'READY',
        productionDate: new Date(2026, 0, 9),
        oilQuality: 'Premium',
        impurities: 0.03,
        processingNotes: 'Premium quality oil'
      },
      {
        batchId: 'OB-003-2026',
        coconutBatchId: coconutBatches[3]._id,
        yieldLiters: 5400,
        acidValue: 0.40,
        moisture: 0.15,
        status: 'PROCESSING',
        productionDate: new Date(2026, 0, 11),
        oilQuality: 'Standard',
        impurities: 0.08,
        processingNotes: 'Currently being processed'
      }
    ]);
    console.log('✓ Created 3 oil batches');

    // Create charcoal batches
    const charcoalBatches = await CharcoalBatch.insertMany([
      {
        batchId: 'CHB-001-2026',
        feedstockKg: 2500,
        yieldKg: 1250,
        carbonContent: 78.5,
        ashContent: 8.2,
        conversionRate: 50,
        status: 'READY',
        productionDate: new Date(2026, 0, 9),
        notes: 'High quality charcoal batch'
      },
      {
        batchId: 'CHB-002-2026',
        feedstockKg: 1800,
        yieldKg: 900,
        carbonContent: 76.3,
        ashContent: 9.1,
        conversionRate: 50,
        status: 'READY',
        productionDate: new Date(2026, 0, 10),
        notes: 'Good quality output'
      },
      {
        batchId: 'CHB-003-2026',
        feedstockKg: 3000,
        yieldKg: 1500,
        carbonContent: 79.2,
        ashContent: 7.8,
        conversionRate: 50,
        status: 'COOLING',
        productionDate: new Date(2026, 0, 11),
        notes: 'Currently in cooling phase'
      }
    ]);
    console.log('✓ Created 3 charcoal batches');

    // Create by-products
    const byProducts = await ByProduct.insertMany([
      {
        type: 'HUSK',
        coconutBatchId: coconutBatches[0]._id,
        weightKg: 1200,
        quality: 'A',
        collectionDate: new Date(2026, 0, 8),
        storageLocation: 'Warehouse A - Section 1',
        status: 'STORED',
        notes: 'High quality husk'
      },
      {
        type: 'SHELL',
        coconutBatchId: coconutBatches[1]._id,
        weightKg: 800,
        quality: 'A',
        collectionDate: new Date(2026, 0, 9),
        storageLocation: 'Warehouse A - Section 2',
        status: 'STORED',
        notes: 'Quality shell material'
      },
      {
        type: 'COIR',
        coconutBatchId: coconutBatches[2]._id,
        weightKg: 450,
        quality: 'B',
        collectionDate: new Date(2026, 0, 10),
        storageLocation: 'Warehouse B - Section 1',
        status: 'COLLECTED',
        notes: 'Standard coir material'
      },
      {
        type: 'HUSK',
        coconutBatchId: coconutBatches[3]._id,
        weightKg: 1400,
        quality: 'A',
        collectionDate: new Date(2026, 0, 11),
        storageLocation: 'Warehouse A - Section 3',
        status: 'STORED',
        notes: 'Premium husk batch'
      }
    ]);
    console.log('✓ Created 4 by-product records');

    // Create inventory items
    const inventoryItems = await Inventory.insertMany([
      {
        productId: 'PROD-OIL-001',
        productName: 'Coconut Oil - Premium',
        category: 'OIL',
        quantityOnHand: 8700,
        reorderLevel: 2000,
        reorderQuantity: 5000,
        unit: 'kg',
        batch: 'OB-001-2026, OB-002-2026',
        status: 'IN_STOCK'
      },
      {
        productId: 'PROD-CHAR-001',
        productName: 'Charcoal - Industrial Grade',
        category: 'CHARCOAL',
        quantityOnHand: 4800,
        reorderLevel: 1500,
        reorderQuantity: 3000,
        unit: 'kg',
        batch: 'CHB-001-2026, CHB-002-2026',
        status: 'IN_STOCK'
      },
      {
        productId: 'PROD-BYP-001',
        productName: 'Coconut Husk Fiber',
        category: 'BYPRODUCT',
        quantityOnHand: 2650,
        reorderLevel: 500,
        reorderQuantity: 1500,
        unit: 'kg',
        batch: 'Mixed batches',
        status: 'IN_STOCK'
      },
      {
        productId: 'PROD-PKG-001',
        productName: 'Packaging Materials',
        category: 'PACKAGING',
        quantityOnHand: 1200,
        reorderLevel: 300,
        reorderQuantity: 1000,
        unit: 'units',
        location: 'Warehouse C',
        status: 'IN_STOCK'
      },
      {
        productId: 'PROD-CHAR-002',
        productName: 'Coconut Shell Charcoal',
        category: 'CHARCOAL',
        quantityOnHand: 1600,
        reorderLevel: 400,
        reorderQuantity: 1000,
        unit: 'kg',
        batch: 'CHB-003-2026',
        status: 'IN_STOCK'
      }
    ]);
    console.log('✓ Created 5 inventory items');

    // Create sales orders
    const salesOrders = await SalesOrder.insertMany([
      {
        orderId: 'SO-001-2026',
        customerName: 'Green Energy Co.',
        orderDate: new Date(2026, 0, 5),
        deliveryDate: new Date(2026, 0, 8),
        items: [
          { productName: 'Coconut Oil - Premium', quantity: 500, unitPrice: 85.50 }
        ],
        totalLkr: 42750,
        paymentStatus: 'PAID',
        status: 'DELIVERED'
      },
      {
        orderId: 'SO-002-2026',
        customerName: 'Eco Products Ltd',
        orderDate: new Date(2026, 0, 8),
        deliveryDate: new Date(2026, 0, 11),
        items: [
          { productName: 'Charcoal - Industrial Grade', quantity: 800, unitPrice: 45.00 },
          { productName: 'Coconut Husk Fiber', quantity: 200, unitPrice: 12.50 }
        ],
        totalLkr: 38500,
        paymentStatus: 'PAID',
        status: 'SHIPPED'
      },
      {
        orderId: 'SO-003-2026',
        customerName: 'Sustainable Materials Inc',
        orderDate: new Date(2026, 0, 10),
        deliveryDate: new Date(2026, 0, 15),
        items: [
          { productName: 'Coconut Oil - Premium', quantity: 1000, unitPrice: 85.50 },
          { productName: 'Charcoal - Industrial Grade', quantity: 400, unitPrice: 45.00 }
        ],
        totalLkr: 103500,
        paymentStatus: 'PENDING',
        status: 'CONFIRMED'
      },
      {
        orderId: 'SO-004-2026',
        customerName: 'Bio Fuel Solutions',
        orderDate: new Date(2026, 0, 11),
        deliveryDate: new Date(2026, 0, 13),
        items: [
          { productName: 'Charcoal - Industrial Grade', quantity: 600, unitPrice: 45.00 }
        ],
        totalLkr: 27000,
        paymentStatus: 'PAID',
        status: 'CONFIRMED'
      }
    ]);
    console.log('✓ Created 4 sales orders');

    // Create quality records
    const qualityRecords = await QualityRecord.insertMany([
      {
        batchId: 'OB-001-2026',
        batchType: 'OIL',
        testDate: new Date(2026, 0, 8),
        testerName: 'John Smith',
        parameters: {
          acidValue: 0.35,
          moisturePercentage: 0.12,
          impurityPercentage: 0.05,
          colorRating: 'Golden',
          odor: 'Mild Coconut'
        },
        passed: true,
        remarks: 'Excellent quality - meets premium standards',
        nextTestDate: new Date(2026, 1, 8)
      },
      {
        batchId: 'CHB-001-2026',
        batchType: 'CHARCOAL',
        testDate: new Date(2026, 0, 9),
        testerName: 'Jane Doe',
        parameters: {
          carbonContent: 78.5,
          ashContent: 8.2,
          impurityPercentage: 0.8,
          colorRating: 'Black',
          odor: 'None'
        },
        passed: true,
        remarks: 'High quality charcoal - industrial grade',
        nextTestDate: new Date(2026, 1, 9)
      },
      {
        batchId: 'OB-002-2026',
        batchType: 'OIL',
        testDate: new Date(2026, 0, 10),
        testerName: 'John Smith',
        parameters: {
          acidValue: 0.28,
          moisturePercentage: 0.10,
          impurityPercentage: 0.03,
          colorRating: 'Golden',
          odor: 'Mild Coconut'
        },
        passed: true,
        remarks: 'Premium quality - best in batch',
        nextTestDate: new Date(2026, 1, 10)
      },
      {
        batchId: 'CB-003-2026',
        batchType: 'OIL',
        testDate: new Date(2026, 0, 11),
        testerName: 'Jane Doe',
        parameters: {
          moisturePercentage: 12.5,
          impurityPercentage: 3.0,
          colorRating: 'Light Brown',
          odor: 'Normal'
        },
        passed: false,
        remarks: 'Minor defects found - recommended for grade B processing',
        nextTestDate: new Date(2026, 0, 13)
      },
      {
        batchId: 'CHB-002-2026',
        batchType: 'CHARCOAL',
        testDate: new Date(2026, 0, 11),
        testerName: 'John Smith',
        parameters: {
          carbonContent: 76.3,
          ashContent: 9.1,
          impurityPercentage: 1.5,
          colorRating: 'Black',
          odor: 'None'
        },
        passed: true,
        remarks: 'Good quality - standard industrial grade',
        nextTestDate: new Date(2026, 1, 11)
      }
    ]);
    console.log('✓ Created 5 quality records');

    // Summary statistics
    console.log('\n========== DATABASE SEEDING COMPLETE ==========');
    console.log(`✓ Users: ${users.length}`);
    console.log(`✓ Coconut Batches: ${coconutBatches.length}`);
    console.log(`✓ Oil Batches: ${oilBatches.length}`);
    console.log(`✓ Charcoal Batches: ${charcoalBatches.length}`);
    console.log(`✓ By-Products: ${byProducts.length}`);
    console.log(`✓ Inventory Items: ${inventoryItems.length}`);
    console.log(`✓ Sales Orders: ${salesOrders.length}`);
    console.log(`✓ Quality Records: ${qualityRecords.length}`);
    console.log('============================================\n');

    console.log('Test Users Created:');
    users.forEach(user => {
      console.log(`  - ${user.username} (${user.role}) - Password: ${user.password}`);
    });

    await mongoose.connection.close();
    console.log('\n✓ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

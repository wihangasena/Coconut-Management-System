import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: String,
    phone: String,
    role: {
      type: String,
      enum: ['ADMIN', 'MANAGER', 'PRODUCTION', 'QC', 'SALES', 'DELIVERY'],
      default: 'PRODUCTION'
    },
    isActive: { type: Boolean, default: true },
    department: String,
    lastLogin: Date,
  },
  { timestamps: true }
);

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

export default mongoose.model('User', userSchema);

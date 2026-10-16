import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['patient', 'doctor'],
      default: 'patient',
    },
    // Patient-specific
    oneRecordId: {
      type: String,
      unique: true,
      sparse: true, // allows multiple null values
    },
    // Doctor-specific
    hospital: {
      type: String,
      default: '',
    },
    specialization: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Generate unique One-Record ID before saving (patients only)
userSchema.pre('save', async function (next) {
  // Generate oneRecordId for patients
  if (this.role === 'patient' && !this.oneRecordId) {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.oneRecordId = `OR-${random}`;
  }

  // Hash password if modified
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
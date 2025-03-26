import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  continuewatching: {
    type: [String], // ✅ Ensure it's explicitly an array of strings
    default: []     // ✅ Explicitly set the default value
  }
,
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Check if the model already exists
export const userModel = mongoose.models.User || mongoose.model('User', userSchema);

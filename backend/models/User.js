import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  affiliation: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  apiKey: { type: String },
  apiKeyExpiry: { type: Date },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  status: { type: String, enum: ['pending', 'active', 'deactivated'], default: 'pending' },
  signupDisabled: { type: Boolean, default: false },
  requestHistory: [{
    endpoint: String,
    date: Date,
    criteria: mongoose.Schema.Types.Mixed,
    response: mongoose.Schema.Types.Mixed
  }]
});

export default mongoose.model('User', userSchema);

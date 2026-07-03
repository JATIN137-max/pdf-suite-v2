const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  subscriptionExpiry: {
    type: Date,
    default: null
  },
  // --- Solvent AI daily usage tracking ---
  // aiUsageDate is a 'YYYY-MM-DD' string. Whenever it doesn't match
  // today's date, aiController resets aiUsageCount back to 0 - this is
  // how the daily cap resets at midnight without a cron job.
  aiUsageCount: {
    type: Number,
    default: 0
  },
  aiUsageDate: {
    type: String,
    default: null
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
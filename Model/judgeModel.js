import mongoose from 'mongoose';

const judgeSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  expertiseAndQualification: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  verificationCode:{type:String},
  verificationCodeExpiry: { type: Date },
  isVerified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Judge = mongoose.model('Judge', judgeSchema);

export default Judge;

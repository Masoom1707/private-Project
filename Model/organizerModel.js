import mongoose from 'mongoose';

const organizerSchema = new mongoose.Schema({
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
  affiliatedOrganization: {
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

const Organizer = mongoose.model('Organizer', organizerSchema);

export default Organizer;

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
  confirmPassword: {
    type: String,
    required: true,
  },
  verificationCode:{type:String},
  isVerified: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

const Organizer = mongoose.model('Organizer', organizerSchema);

export default Organizer;

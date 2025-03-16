import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  DOB: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  collegeName: {
    type: String,
    enum: ['Niagara College Toronto', 'Toronto School of Management', 'Fleming College'],
    required: true,
  },
  studentID: {
    type: String,
    required: true,
  },
  majorOrDept: {
    type: String,
    required: true,
  },
  termsAndConditions: {
    type: Boolean,
    required: true,
  },
  signingUpAsMentor: {
    type: Boolean,
    default: false,
  },
  mentorAccessCode: {
    type: String,
    required: function () { return this.signingUpAsMentor; }
  },
  verificationCode:{type:String},
  isVerified: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

const Participant = mongoose.model('Participant', participantSchema);

export default Participant;

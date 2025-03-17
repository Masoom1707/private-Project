import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  teamLeader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant',
    required: true,
  },
  teamMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Participant',
    }
  ],
  joinCode: {
    type: String,
    required: true,
    unique: true,
  },
  projectTitle: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  githubRepo: {
    type: String,
    trim: true,
  },
  hostedURL: {
    type: String,
    trim: true,
  },
  submissionStatus: {
    type: String,
    enum: ['pending', 'submitted', 'reviewed'],
    default: 'pending',
  },
  score: [
    {
      judgeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Judge',
      },
      marks: {
        type: Number,
        default: 0,
      },
      feedback: {
        type: String,
        trim: true,
      },
      judgeName: {
        type: String,
        trim: true,
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Team = mongoose.model('Team', teamSchema);

export default Team;

import Team from '../Model/teamModel.js';
import Participant from '../Model/participantModel.js';
import crypto from 'crypto';

// Controller Function for Creating a Team
export const createTeam = async (req, res) => {
  const { teamName } = req.body;

  
  if (!teamName) {
    return res.status(400).json({ error: 'Team name is required.' });
  }

  try {
    const participant = await Participant.findById(req.user.id);

    
    if (!participant || !participant.isVerified) {
      return res.status(403).json({ error: 'Only verified participants can create teams.' });
    }

    
    const existingTeam = await Team.findOne({ teamName });
    if (existingTeam) {
      return res.status(400).json({ error: 'Team name already exists.' });
    }

  
    const joinCode = crypto.randomBytes(3).toString('hex').toUpperCase();

    
    const newTeam = await Team.create({
      teamName,
      teamLeader: participant._id,
      teamMembers: [participant._id],
      joinCode,
    });

    res.status(201).json({
      message: 'Team created successfully!',
      team: {
        teamName: newTeam.teamName,
        joinCode: newTeam.joinCode,
      },
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
};

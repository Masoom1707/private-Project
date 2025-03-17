import express from 'express';
import { 
  registerOrganizer, 
  registerJudge, 
  registerParticipant, 
  verifyEmail,
  loginUser,
  logoutUser,
  updateProfile
} from '../Controller/authController.js';
import { authenticateUser } from '../middleware/authUser.js';


const router = express.Router();

router.post('/register/organizer', registerOrganizer);
router.post('/register/judge', registerJudge);
router.post('/register/participant', registerParticipant);
router.post('/verify-email', verifyEmail);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

router.put('/update-profile', authenticateUser, updateProfile);

export default router;

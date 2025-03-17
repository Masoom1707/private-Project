import express from 'express';
import { 
  registerOrganizer, 
  registerJudge, 
  registerParticipant, 
  verifyEmail,
  loginUser
} from '../Controller/authController.js';


const router = express.Router();

router.post('/register/organizer', registerOrganizer);
router.post('/register/judge', registerJudge);
router.post('/register/participant', registerParticipant);
router.post('/verify-email', verifyEmail);
router.post('/login', loginUser);

export default router;

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import Organizer from '../Model/organizerModel.js';
import Judge from '../Model/judgeModel.js';
import Participant from '../Model/participantModel.js';

import { sendVerificationEmail } from '../utils/emailService.js';

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Controller Function for the Organizer Register

export const registerOrganizer = async (req, res) => {
  const { userName, fullName, email, affiliatedOrganization, password, confirmPassword } = req.body;

  if (!userName || !fullName || !email || !affiliatedOrganization || !password || !confirmPassword) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  try {
    const existingUser = await Organizer.findOne({ $or: [{ email }, { userName }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email or username.' });
    }

    const hashedPassword = await hashPassword(password);

    // generating the random code for the verification
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    const verificationCodeExpiry = new Date();
    verificationCodeExpiry.setMinutes(verificationCodeExpiry.getMinutes() + 10);


    const newOrganizer = await Organizer.create({
      userName,
      fullName,
      email,
      affiliatedOrganization,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpiry,
      isVerified: false
    });
  
      await sendVerificationEmail(email, verificationCode)

    res.status(201).json({
      message: 'Organizer registered successfully!',
      user: { id: newOrganizer._id, userName, email },
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
};


// Controller Function for the Judge Register

export const registerJudge = async (req, res) => {
  const { userName, fullName, email, expertiseAndQualification, password, confirmPassword } = req.body;

  if (!userName || !fullName || !email || !expertiseAndQualification || !password || !confirmPassword) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  try {
    const existingUser = await Judge.findOne({ $or: [{ email }, { userName }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email or username.' });
    }

    const hashedPassword = await hashPassword(password);

    const verificationCode = crypto.randomInt(100000, 999999).toString();

    const verificationCodeExpiry = new Date();
    verificationCodeExpiry.setMinutes(verificationCodeExpiry.getMinutes() + 10);


    const newJudge = await Judge.create({
      userName,
      fullName,
      email,
      expertiseAndQualification,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpiry,
      isVerified: false
    });

    await sendVerificationEmail(email, verificationCode)

    res.status(201).json({
      message: 'Judge registered successfully!',
      user: { id: newJudge._id, userName, email },
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
};

// Controller function for the Participant Registration


export const registerParticipant = async (req, res) => {
  const { 
    userName, fullName, DOB, email, password, confirmPassword, collegeName, 
    studentID, majorOrDept, termsAndConditions, signingUpAsMentor, mentorAccessCode 
  } = req.body;

  if (!userName || !fullName || !DOB || !email || !password || !confirmPassword || !collegeName ||
      !studentID || !majorOrDept || !termsAndConditions) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  if (signingUpAsMentor && !mentorAccessCode) {
    return res.status(400).json({ error: 'Mentor Access Code is required for mentors.' });
  }

  try {
    const existingUser = await Participant.findOne({ $or: [{ email }, { userName }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email or username.' });
    }

    const hashedPassword = await hashPassword(password);

    const verificationCode = crypto.randomInt(100000, 999999).toString();

    const verificationCodeExpiry = new Date();
    verificationCodeExpiry.setMinutes(verificationCodeExpiry.getMinutes() + 10);


    const newParticipant = await Participant.create({
      userName,
      fullName,
      DOB,
      email,
      password: hashedPassword,
      collegeName,
      studentID,
      majorOrDept,
      termsAndConditions,
      signingUpAsMentor,
      mentorAccessCode: signingUpAsMentor ? mentorAccessCode : undefined,
      verificationCode,
      verificationCodeExpiry,
      isVerified: false
    });


    await sendVerificationEmail(email, verificationCode)

    res.status(201).json({
      message: 'Participant registered successfully!',
      user: { id: newParticipant._id, userName, email },
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
};


// Email verification 
export const verifyEmail = async (req, res) => {
    const { email, verificationCode } = req.body;
  
    if (!email || !verificationCode) {
      return res.status(400).json({ error: 'Email and verification code are required.' });
    }
  
    try {
      const user =
      (await Organizer.findOne({ email })) ||
      (await Judge.findOne({ email })) ||
      (await Participant.findOne({ email }));
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      if (user.isVerified) {
        return res.status(400).json({ error: 'Email is already verified or registered for the different roles' });
      }

      if (new Date(user.verificationCodeExpiry).toISOString() <= new Date().toISOString()) {
        return res.status(400).json({ error: 'Verification code expired. Please request a new one.' });
      }
  
      if (user.verificationCode !== verificationCode) {
        return res.status(400).json({ error: 'Invalid verification code.' });
      }
  
      user.isVerified = true;
      user.verificationCode = undefined;
      await user.save();
  
      res.status(200).json({ message: 'Email verified successfully!' });
  
    } catch (error) {
      res.status(500).json({ error: 'Server error. Please try again.' });
    }
  };
  


  // Login controller function
  export const loginUser = async (req, res) => {
    const { emailOrUsername, password } = req.body;
  
    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: 'Email/Username and Password are required.' });
    }
  
    try {

      // Checking the username and the email in all the userType that user provided us 
      const user = 
        (await Organizer.findOne({ $or: [{ email: emailOrUsername }, { userName: emailOrUsername }] })) ||
        (await Judge.findOne({ $or: [{ email: emailOrUsername }, { userName: emailOrUsername }] })) ||
        (await Participant.findOne({ $or: [{ email: emailOrUsername }, { userName: emailOrUsername }] }));
  
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      if (!user.isVerified) {
        return res.status(403).json({ error: 'Please verify your email before logging in.' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials.' });
      }
  
      // Generating the JWT Token
      const token = jwt.sign(
        { id: user._id, role: user.role }, 
        process.env.SECRET_TOKEN, 
        { expiresIn: process.env.SECRET_TOKEN_EXPIRY }
      );
  
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'Lax',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });
  
      res.status(200).json({
        message: 'Login successful!',
        user: { id: user._id, userName: user.userName, email: user.email }
      });
  
    } catch (error) {
      res.status(500).json({ error: 'Server error. Please try again.' });
    }
  };
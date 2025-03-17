import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { connectDB } from "./db/dbConnection.js";

import authRoutes from './Router/authRoutes.js'



const app = express();


const PORT = process.env.PORT || 4000;

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
  origin:"http://localhost:5173",
  credentials: true
}))


app.use('/api/auth', authRoutes);



connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT", PORT);
  });
});

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { User } from "../models/userModel";
import { asyncHandler } from "../utils/asyncHandler";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, username, password } = req.body;

  // Validate required fields
  if (!name || !email || !username || !password) {
    return res.status(400).json({
      error: "Missing required fields: name, email, username, password",
    });
  }

  // Hash password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Create user
  const user = new User({
    name,
    email,
    username,
    passwordHash,
  });

  const savedUser = await user.save();

  // Return user without password
  const userResponse = {
    id: savedUser._id,
    name: savedUser.name,
    email: savedUser.email,
    username: savedUser.username,
  };

  res.status(201).json(userResponse);
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  // Find user by username
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  // Verify password
  const passwordCorrect = await bcrypt.compare(password, user.passwordHash);
  if (!passwordCorrect) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  // Generate JWT token
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    return res.status(500).json({ error: "JWT secret not configured" });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, JWT_SECRET, { expiresIn: "24h" });

  // Return token and user details
  res.status(200).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
    },
  });
});

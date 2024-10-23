import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../Models/userModel";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response): Promise<any> => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const age: number = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: age }
    );
    res
      .cookie("token", token, {
        httpOnly: true,
        // secure:true,
        maxAge: age,
      })
      .status(200)
      .json({
        message: "Login successful",
        user: { name: existingUser.name, email: existingUser.email },
      });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const logout = (req: Request, res: Response): void => {
  res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};
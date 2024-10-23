import { Request, Response } from "express";
import User from "../Models/userModel"; // Import the User model
import bcrypt from "bcryptjs"; // To hash the new password
interface CustomRequest extends Request {
  userId?: string; // Optional userId property
}
// Controller to update user profile
export const updateProfile = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  const { name, newPassword } = req.body;
  const userId = req.userId; // Assuming you get userId from middleware (like JWT auth)

  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's name if provided
    if (name) {
      user.name = name;
    }

    // Update and hash the new password if provided
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Save the updated user in the database
    await user.save();

    return res
      .status(200)
      .json({ message: "Profile updated successfully", user });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

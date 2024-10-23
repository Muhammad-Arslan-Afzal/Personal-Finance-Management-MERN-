import mongoose, { Schema, Document } from "mongoose";

// Interface for the User Document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

// Create the User schema
const userSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [3, "Name must be at least 3 characters long"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
});

// Export the model based on the schema
export default mongoose.model<IUser>("User", userSchema);

import { Schema, model, Document, Types } from "mongoose"; // Import Types for ObjectId

// Extend the Expense interface to use ObjectId for userId
interface Expense extends Document {
  userId: Types.ObjectId; // Use ObjectId for the userId
  category: string;
  amount: number;
  currency: string;
  dateSpent: string;
}

const expenseSchema = new Schema<Expense>({
  userId: {
    type: Schema.Types.ObjectId, // ObjectId type for references
    required: true,
    ref: "User", // Reference to the User model
  },
  category: {
    type: String,
    required: true,
    enum: ["Rent", "Food", "Entertainment"], // restrict to these values
  },
  amount: {
    type: Number,
    required: true,
    min: [0, "Amount must be a positive number"], // ensure amount is positive
  },
  currency: {
    type: String,
    required: true,
    enum: ["€", "$"], // restrict to available currencies
  },
  dateSpent: {
    type: String,
    required: true,
  },
});

const ExpenseModel = model<Expense>("Expense", expenseSchema);

export default ExpenseModel;

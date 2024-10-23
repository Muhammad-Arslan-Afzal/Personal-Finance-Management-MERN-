import { Schema, model, Document, Types } from "mongoose"; // Import Types for ObjectId

// Extend the Income interface to use ObjectId for userId
interface Income extends Document {
  userId: Types.ObjectId; // Use ObjectId for the userId
  source: string;
  amount: number;
  currency: string;
  dateReceived: string;
}

const incomeSchema = new Schema<Income>({
  userId: {
    type: Schema.Types.ObjectId, // ObjectId type for references
    required: true,
    ref: "User", // Reference to the User model
  },
  source: {
    type: String,
    required: true,
    enum: ["Salary", "Freelance", "Investments", "Rent", "Dividends", "Others"], // restrict to these values
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
  dateReceived: {
    type: String,
    required: true,
  },
});

const IncomeModel = model<Income>("Income", incomeSchema);

export default IncomeModel;

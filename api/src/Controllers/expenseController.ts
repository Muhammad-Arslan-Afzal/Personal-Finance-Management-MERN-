import { Request, Response } from "express";
import Expense from "../Models/ExpenseModel"; // Import your Expense model
interface CustomRequest extends Request {
  userId?: string; // Optional userId property
}

// Get all expenses for the logged-in user
export const getExpenses = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(403).json({ message: "No user ID found" });
    }

    // Fetch expenses specific to the logged-in user
    const expenses = await Expense.find({ userId }); // Assuming each expense has a 'userId' field
    res.status(200).json(expenses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new expense
export const addExpense = async (req: Request, res: Response): Promise<any> => {
  try {
    const { category, amount, currency, dateSpent } = req.body;
    // Ensure the userId is available from the verifyToken middleware
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    // Create a new expense document with the userId
    const newExpense = new Expense({
      userId, // Attach the userId from the token
      category,
      amount,
      currency,
      dateSpent: new Date(dateSpent), // Ensure date formatting
    });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an expense
export const deleteExpense = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    // Ensure the userId is available from the verifyToken middleware
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Find the expense to ensure it belongs to the authenticated user
    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this expense" });
    }

    await Expense.findByIdAndDelete(id);
    res.status(200).json({ message: "Expense deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Edit an expense
export const editExpense = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const { category, amount, currency, dateSpent } = req.body;

    // Ensure the userId is available from the verifyToken middleware
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Find the expense to ensure it belongs to the authenticated user
    const expense = await Expense.findById(id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this expense" });
    }

    // Proceed with updating the expense entry
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { category, amount, currency, dateSpent: new Date(dateSpent) },
      { new: true }
    );

    res.status(200).json(updatedExpense);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

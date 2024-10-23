import { Request, Response } from "express";
import Income from "../Models/IncomeModel"; // Import your model
interface CustomRequest extends Request {
  userId?: string; // Optional userId property
}
export const getIncomes = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(403).json({ message: "No user ID found" });
    }

    // Fetch incomes specific to the logged-in user
    const incomes = await Income.find({ userId }); // Assuming each income has a 'userId' field
    res.status(200).json(incomes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new income

export const addIncome = async (req: Request, res: Response): Promise<any> => {
  try {
    const { source, amount, currency, dateReceived } = req.body;

    // Ensure the userId is available from the verifyToken middleware
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Create a new income document with the userId
    const newIncome = new Income({
      userId, // Attach the userId from the token
      source,
      amount,
      currency,
      dateReceived: new Date(dateReceived), // Ensure date formatting
    });

    await newIncome.save();
    res.status(201).json(newIncome);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete

export const deleteIncome = async (
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

    // Find the income to ensure it belongs to the authenticated user
    const income = await Income.findById(id);

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    if (income.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this income" });
    }

    await Income.findByIdAndDelete(id);
    res.status(200).json({ message: "Income deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Edit income

export const editIncome = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { source, amount, currency, dateReceived } = req.body;

    // Ensure the userId is available from the verifyToken middleware
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Find the income to ensure it belongs to the authenticated user
    const income = await Income.findById(id);

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    if (income.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this income" });
    }

    // Proceed with updating the income entry
    const updatedIncome = await Income.findByIdAndUpdate(
      id,
      { source, amount, currency, dateReceived: new Date(dateReceived) },
      { new: true }
    );

    res.status(200).json(updatedIncome);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

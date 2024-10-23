import { Request, Response } from "express";
import Income from "../Models/IncomeModel"; // Import your income model
import Expense from "../Models/ExpenseModel"; // Import your expense model
import mongoose from "mongoose"; // Import mongoose to convert string to ObjectId

interface CustomRequest extends Request {
  userId?: string; // Optional userId property
}

export const getSavings = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.userId;
    const year = req.params.year; // Get the year from the request params

    if (!userId) {
      return res.status(403).json({ message: "No user ID found" });
    }

    // Convert userId to ObjectId if it's a string
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Aggregate incomes by month, currency, and sum the total
    const incomes = await Income.aggregate([
      {
        $match: {
          userId: userObjectId,
          dateReceived: { $regex: year }, // Match documents based on the year
        },
      },
      {
        $addFields: {
          monthName: {
            $dateToString: {
              format: "%B", // Full month name
              date: {
                $dateFromString: {
                  dateString: {
                    $substr: ["$dateReceived", 0, 24], // Trim to the first 24 characters for valid date
                  },
                },
              },
            },
          },
        },
      },
      {
        $group: {
          _id: { month: "$monthName", currency: "$currency" }, // Group by month and currency
          totalIncome: { $sum: "$amount" }, // Sum the amount for each month and currency
        },
      },
      {
        $project: {
          month: "$_id.month",
          currency: "$_id.currency",
          totalIncome: 1,
          _id: 0,
        },
      },
    ]);

    // Aggregate expenses by month, currency, and sum the total
    const expenses = await Expense.aggregate([
      {
        $match: {
          userId: userObjectId,
          dateSpent: { $regex: year }, // Match documents based on the year
        },
      },
      {
        $addFields: {
          monthName: {
            $dateToString: {
              format: "%B", // Full month name
              date: {
                $dateFromString: {
                  dateString: {
                    $substr: ["$dateSpent", 0, 24], // Trim to the first 24 characters for valid date
                  },
                },
              },
            },
          },
        },
      },
      {
        $group: {
          _id: { month: "$monthName", currency: "$currency" }, // Group by month and currency
          totalExpense: { $sum: "$amount" }, // Sum the amount for each month and currency
        },
      },
      {
        $project: {
          month: "$_id.month",
          currency: "$_id.currency",
          totalExpense: 1,
          _id: 0,
        },
      },
    ]);

    // Merge incomes and expenses to calculate savings
    const savings: any = [];

    // Combine income and expense data based on month and currency
    incomes.forEach((income) => {
      const expense = expenses.find(
        (e) => e.month === income.month && e.currency === income.currency
      );
      const totalExpense = expense ? expense.totalExpense : 0;

      savings.push({
        month: income.month,
        currency: income.currency,
        savings: income.totalIncome - totalExpense, // Calculate savings
      });
    });

    // Include any months with expenses but no incomes
    expenses.forEach((expense) => {
      const income = incomes.find(
        (i) => i.month === expense.month && i.currency === expense.currency
      );
      if (!income) {
        savings.push({
          month: expense.month,
          currency: expense.currency,
          savings: -expense.totalExpense, // Only expenses, so negative savings
        });
      }
    });

    res.status(200).json(savings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

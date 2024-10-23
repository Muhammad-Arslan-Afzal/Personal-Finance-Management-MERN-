import { Request, Response } from "express";
import Income from "../Models/IncomeModel"; // Import your income model
import Expense from "../Models/ExpenseModel"; // Import your expense model
import mongoose from "mongoose"; // Import mongoose to convert string to ObjectId

interface CustomRequest extends Request {
  userId?: string; // Optional userId property
}

export const homeData = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(403).json({ message: "No user ID found" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const currentYear = new Date().getFullYear(); // Get the current year

    // Mongoose aggregation to sum incomes for each month and currency
    const incomeSummary = await Income.aggregate([
      {
        $match: {
          userId: userObjectId,
          dateReceived: {
            $regex: `${currentYear}`, // Match records that contain the current year in the date string
          },
        },
      },
      {
        // Add a field to extract month from dateReceived string
        $addFields: {
          month: {
            $substr: [
              {
                $arrayElemAt: [
                  { $split: ["$dateReceived", " "] }, // Split the string into an array
                  1, // Get the month (e.g., "Oct")
                ],
              },
              0,
              3, // Use only the first three characters for month abbreviation
            ],
          },
        },
      },
      {
        // Map month abbreviations to numbers
        $addFields: {
          monthNumber: {
            $switch: {
              branches: [
                { case: { $eq: ["$month", "Jan"] }, then: 1 },
                { case: { $eq: ["$month", "Feb"] }, then: 2 },
                { case: { $eq: ["$month", "Mar"] }, then: 3 },
                { case: { $eq: ["$month", "Apr"] }, then: 4 },
                { case: { $eq: ["$month", "May"] }, then: 5 },
                { case: { $eq: ["$month", "Jun"] }, then: 6 },
                { case: { $eq: ["$month", "Jul"] }, then: 7 },
                { case: { $eq: ["$month", "Aug"] }, then: 8 },
                { case: { $eq: ["$month", "Sep"] }, then: 9 },
                { case: { $eq: ["$month", "Oct"] }, then: 10 },
                { case: { $eq: ["$month", "Nov"] }, then: 11 },
                { case: { $eq: ["$month", "Dec"] }, then: 12 },
              ],
              default: 0, // If not a valid month, return 0
            },
          },
        },
      },
      {
        // Group by month number and currency, summing the amounts
        $group: {
          _id: { month: "$monthNumber", currency: "$currency" },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        // Sort by month number for better readability
        $sort: { "_id.month": 1 },
      },
      {
        // Project the final output fields
        $project: {
          _id: 0, // Exclude _id field from output
          monthName: {
            $arrayElemAt: [
              [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ],
              { $subtract: ["$_id.month", 1] }, // Adjust to 0-indexed array
            ],
          },
          currency: "$_id.currency",
          totalAmount: 1,
        },
      },
    ]);

    // Mongoose aggregation to sum expenses for each month and currency for the current year
    const expenseSummary = await Expense.aggregate([
      {
        $match: {
          userId: userObjectId,
          dateSpent: {
            $regex: `${currentYear}`, // Match records that contain the current year in the date string
          },
        },
      },
      {
        // Add a field to extract month from dateSpent string
        $addFields: {
          month: {
            $substr: [
              {
                $arrayElemAt: [
                  { $split: ["$dateSpent", " "] }, // Split the string into an array
                  1, // Get the month (e.g., "Oct")
                ],
              },
              0,
              3, // Use only the first three characters for month abbreviation
            ],
          },
        },
      },
      {
        // Map month abbreviations to numbers
        $addFields: {
          monthNumber: {
            $switch: {
              branches: [
                { case: { $eq: ["$month", "Jan"] }, then: 1 },
                { case: { $eq: ["$month", "Feb"] }, then: 2 },
                { case: { $eq: ["$month", "Mar"] }, then: 3 },
                { case: { $eq: ["$month", "Apr"] }, then: 4 },
                { case: { $eq: ["$month", "May"] }, then: 5 },
                { case: { $eq: ["$month", "Jun"] }, then: 6 },
                { case: { $eq: ["$month", "Jul"] }, then: 7 },
                { case: { $eq: ["$month", "Aug"] }, then: 8 },
                { case: { $eq: ["$month", "Sep"] }, then: 9 },
                { case: { $eq: ["$month", "Oct"] }, then: 10 },
                { case: { $eq: ["$month", "Nov"] }, then: 11 },
                { case: { $eq: ["$month", "Dec"] }, then: 12 },
              ],
              default: 0, // If not a valid month, return 0
            },
          },
        },
      },
      {
        // Group by month number and currency, summing the amounts
        $group: {
          _id: { month: "$monthNumber", currency: "$currency" },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        // Sort by month number for better readability
        $sort: { "_id.month": 1 },
      },
      {
        // Project the final output fields
        $project: {
          _id: 0, // Exclude _id field from output
          monthName: {
            $arrayElemAt: [
              [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ],
              { $subtract: ["$_id.month", 1] }, // Adjust to 0-indexed array
            ],
          },
          currency: "$_id.currency",
          totalAmount: 1,
        },
      },
    ]);

    // Calculate balance for each currency
    const incomeByCurrency: { [key: string]: number } = {};
    const expenseByCurrency: { [key: string]: number } = {};

    incomeSummary.forEach(({ currency, totalAmount }) => {
      incomeByCurrency[currency] =
        (incomeByCurrency[currency] || 0) + totalAmount;
    });

    expenseSummary.forEach(({ currency, totalAmount }) => {
      expenseByCurrency[currency] =
        (expenseByCurrency[currency] || 0) + totalAmount;
    });

    const balancesByCurrency: { [key: string]: number } = {};
    for (const currency of Object.keys(incomeByCurrency)) {
      balancesByCurrency[currency] =
        (balancesByCurrency[currency] || 0) +
        (incomeByCurrency[currency] || 0) -
        (expenseByCurrency[currency] || 0);
    }

    res.status(200).json({
      incomeSummary,
      expenseSummary,
      balancesByCurrency,
    });
  } catch (error) {
    console.error("Error in homeData:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

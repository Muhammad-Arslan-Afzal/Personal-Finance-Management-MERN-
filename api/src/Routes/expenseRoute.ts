import { Router } from "express";
import {
  getExpenses,
  addExpense,
  deleteExpense,
  editExpense,
} from "../Controllers/expenseController"; // Import the expense controller functions
import { verifyToken } from "../Middleware/verifyToken"; // Import the verifyToken middleware

const router = Router();

// Define routes for expense-related actions
router.get("/", verifyToken, getExpenses); // Get all expenses for the logged-in user
router.post("/", verifyToken, addExpense); // Add a new expense
router.delete("/:id", verifyToken, deleteExpense); // Delete an expense by ID
router.put("/:id", verifyToken, editExpense); // Edit an existing expense by ID

export default router;

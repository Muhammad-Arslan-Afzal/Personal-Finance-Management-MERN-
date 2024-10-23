import { Router } from "express";
import {
  getIncomes,
  addIncome,
  deleteIncome,
  editIncome,
} from "../Controllers/incomeController";
import { verifyToken } from "../Middleware/verifyToken";
const router = Router();

// router.get("/", verifyToken);
router.get("/", verifyToken, getIncomes);
router.post("/", verifyToken, addIncome);
router.delete("/:id", verifyToken, deleteIncome);
router.put("/:id", verifyToken, editIncome);

export default router;

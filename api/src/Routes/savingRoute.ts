import { Router } from "express";
import { verifyToken } from "../Middleware/verifyToken";
import { getSavings } from "../Controllers/savingController";
const router = Router();

// router.get("/", verifyToken, getSavings);
router.get("/:year", verifyToken, getSavings);

export default router;

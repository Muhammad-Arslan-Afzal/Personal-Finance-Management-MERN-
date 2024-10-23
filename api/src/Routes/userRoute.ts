import { Router } from "express";
import { updateProfile } from "../Controllers/userController";
import { verifyToken } from "../Middleware/verifyToken";

const router = Router();

router.put("/", verifyToken, updateProfile);

export default router;

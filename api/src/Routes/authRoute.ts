import { Router } from "express";
import { signup, login, logout } from "../Controllers/authController";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;

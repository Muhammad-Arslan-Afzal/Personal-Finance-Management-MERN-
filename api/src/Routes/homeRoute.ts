import { Router } from "express";
import { homeData } from "../Controllers/homeController";
import { verifyToken } from "../Middleware/verifyToken";

const router = Router();

router.get("/", verifyToken, homeData);

export default router;

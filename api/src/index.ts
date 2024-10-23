import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import authRoutes from "./Routes/authRoute";
import incomeRoute from "./Routes/incomeRoute";
import expenseRoute from "./Routes/expenseRoute";
import savingRoute from "./Routes/savingRoute";
import userRoute from "./Routes/userRoute";
import homeRoute from "./Routes/homeRoute";
import connectDB from "./Database/connectDB";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();

const app: Express = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());
const port = process.env.PORT || 8080;
// Middleware to parse JSON bodies
app.use(express.json());
connectDB();
// Use the auth routes
app.get("/", (req: Request, res: Response) => {
  res.send("HELLO, Are you there?");
});

app.use("/api/auth", authRoutes);
app.use("/api/income", incomeRoute);
app.use("/api/expense", expenseRoute);
app.use("/api/saving", savingRoute);
app.use("/api/user", userRoute);
app.use("/api/home", homeRoute);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

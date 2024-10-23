import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Extend the Request interface to include userId
interface CustomRequest extends Request {
  userId?: string; // Optional userId property
}

export const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): any => {
  const token = req.cookies.token;
  //   console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Not Authenticated!" });
  }
  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    async (err: any, payload: any) => {
      if (err) {
        return res.status(403).json({ message: "Token is not Valid!" });
      }
      req.userId = payload.id; // Set userId on the request
      next();
    }
  );
};

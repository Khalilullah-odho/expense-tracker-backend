import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: any;
}

export const isAuthenticated = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers["token"] as string;

    if (!token) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "jwt_secret");

    req.user = decoded;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const isAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers["token"] as string;

    if (!token) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "jwt_secret");

    if (typeof decoded !== "string" && !decoded.is_admin) {
      return res.status(401).json({ message: "unauthorized" });
    }

    req.user = decoded;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

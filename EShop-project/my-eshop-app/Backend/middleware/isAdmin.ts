import { Request, Response, NextFunction } from "express";
import type { MyJwtPayload } from "./authMiddleware";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "משתמש לא מחובר" });
    }

    if (req.user.role === "user") {
      return res.status(403).json({ error: "אין לך הרשאה" });
    }

    next();
  } catch (error) {
    console.error("שגיאה בבדיקת הרשאות:", error);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};

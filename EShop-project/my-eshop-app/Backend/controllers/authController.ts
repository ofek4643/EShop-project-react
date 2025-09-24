import User from "../models/User.js";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { sendEmail } from "../utils/SendEmail.ts";
import jwt, { JwtPayload } from "jsonwebtoken";
const { TokenExpiredError } = jwt;

// הרחבת Request של Express כדי שיהיה לנו userId
interface AuthRequest extends Request {
  user: {
    userId: string;
    role: string;
    userName: string;
  };
}

// טיפוס payload של JWT עבור reset password
interface MyJwtPayload extends JwtPayload {
  userId: string;
}

// רישום משתמש חדש
export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    console.log("📩 Register API נקרא");
    console.log("📥 Body:", req.body);

    const {
      userName,
      email,
      password,
    }: { userName: string; email: string; password: string } = req.body;

    const existingUserName = await User.findOne({ userName });
    console.log("🔍 בדיקת userName:", existingUserName ? "קיים" : "לא קיים");

    const existingEmail = await User.findOne({ email });
    console.log("🔍 בדיקת email:", existingEmail ? "קיים" : "לא קיים");

    if (existingUserName)
      return res.status(400).json({ error: "שם המשתמש כבר רשום במערכת" });

    if (existingEmail)
      return res.status(400).json({ error: "האימייל כבר רשום במערכת" });

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔑 סיסמה הוצפנה בהצלחה");

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      role: "user",
      verified: false,
    });

    await newUser.save();
    console.log("✅ משתמש נשמר במסד נתונים:", newUser._id);

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      throw new Error("חסר מפתח סודי של טוקן");
    }

    const verificationToken = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "15m",
    });
    console.log("🔐 נוצר טוקן אימות");

    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
    const verifyUrl = `${FRONTEND_URL}/verify/${newUser._id}/${verificationToken}`;
    console.log("📧 לינק אימות:", verifyUrl);

    await sendEmail(
      email,
      "אימות כתובת האימייל שלך",
      `
        <h1>שלום ${userName},</h1>
        <p>אנא לחץ על הקישור הבא כדי לאמת את חשבונך:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
      `
    );
    console.log("✉️ מייל אימות נשלח ל:", email);

    return res
      .status(201)
      .json({ message: "נרשמת בהצלחה, אנא אמת את האימייל שלך" });
  } catch (error: any) {
    console.error("❌ שגיאה ב־Register:", error.message || error);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};

// אימות משתמש
export const verifyUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userId, token } = req.params;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      throw new Error("Missing JWT secret");
    }

    jwt.verify(token, JWT_SECRET);

    await User.findByIdAndUpdate(userId, { verified: true });

    return res.status(200).json({ message: "האימייל אומת בהצלחה!" });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ error: "קישור האימות לא חוקי או שפג תוקפו" });
  }
};

// התחברות משתמש
export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "איימל או סיסמא לא נכונים" });
    }
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: "איימל או סיסמא לא נכונים" });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("חסר מפתח סודי של טוקן");
    }

    if (!user.verified) {
      return res
        .status(401)
        .json({ error: "עליך לאמת את כתובת האימייל לפני התחברות" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        userName: user.userName,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });
    return res.status(201).json({ message: "משתמש התחבר בהצלחה!" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};

// התנתקות משתמש
export const logout = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    res.clearCookie("userToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });
    return res.status(200).json({ message: "התנתקת בהצלחה" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};

// התנתקות אדמין
export const logoutAdmin = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });
    return res.status(200).json({ message: "התנתקת בהצלחה" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};

// שכחתי סיסמה
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email }: { email: string } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "אם האימייל קיים, נשלח קישור לאיפוס" });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) throw new Error("חסר JWT_SECRET");

    const resetToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "15m",
    });

    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

    const resetUrl = `${FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      "איפוס סיסמה",
      `
        <h1>שלום ${user.userName},</h1>
        <p>ביקשת לאפס את הסיסמה שלך.</p>
        <p>אנא לחץ על הקישור הבא כדי לבחור סיסמה חדשה (בתוקף ל-15 דקות):</p>
        <a href="${resetUrl}">${resetUrl}</a>
      `
    );

    return res.json({ message: "אם האימייל קיים, נשלח קישור לאיפוס" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};

// איפוס סיסמא
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { token, newPassword }: { token: string; newPassword: string } =
      req.body;

    if (!token) {
      return res.status(400).json({ error: "חסר טוקן " });
    }
    if (!newPassword) return res.status(400).json({ error: "חסר סיסמא" });

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) throw new Error("Missing JWT_SECRET");

    let decoded: MyJwtPayload;

    try {
      decoded = jwt.verify(token, JWT_SECRET) as MyJwtPayload;
    } catch (err: any) {
      if (err instanceof TokenExpiredError) {
        return res.status(401).json({ error: "הטוקן פג תוקף" });
      }
      return res.status(401).json({ error: "טוקן לא חוקי" });
    }

    const userId = decoded.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "משתמש לא נמצא" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({ message: "הסיסמה עודכנה בהצלחה" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};

// התחברות אדמין
export const loginAdmin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ error: "אימייל או סיסמה לא נכונים, או שאינך מנהל" });
    }

    if (user.role === "user") {
      return res
        .status(401)
        .json({ error: "אימייל או סיסמה לא נכונים, או שאינך מנהל" });
    }
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res
        .status(400)
        .json({ error: "אימייל או סיסמה לא נכונים, או שאינך מנהל" });
    }

    const randomNumber = Math.floor(Math.random() * 1000000);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.code = randomNumber;
    user.codeExpiresAt = expiresAt;
    await user.save();

    await sendEmail(
      user.email,
      "קוד אימות כניסה - E-Shop CRM",
      `
        <h1>שלום ${user.userName},</h1>
        <h2>קוד האימות שלך הוא: ${randomNumber}</h2>
        <span>הקוד בתוקף ל-10 דקות.</span>
      `
    );

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("חסר מפתח סודי של טוקן");
    }

    const Token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "10m",
    });

    res.cookie("tokenCode", Token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({ message: "קוד אימות נשלח לאיימל שלך" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};

// בדיקת קוד להתחברות אדמין
export const verifyAdminOtp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { code }: { code: string } = req.body;
    const { tokenCode } = req.cookies;

    if (!code || code.length !== 6) {
      return res.status(400).json({ error: "קוד לא תקין" });
    }

    if (!tokenCode) {
      return res.status(400).json({ error: "חסר טוקן" });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) throw new Error("Missing JWT_SECRET");

    let decoded: MyJwtPayload;
    try {
      decoded = jwt.verify(tokenCode, JWT_SECRET) as MyJwtPayload;
    } catch (err: any) {
      if (err instanceof TokenExpiredError) {
        return res.status(401).json({ error: "הטוקן פג תוקף" });
      }
      return res.status(401).json({ error: "טוקן לא חוקי" });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "משתמש לא נמצא" });
    }

    if (user.code !== Number(code)) {
      return res.status(400).json({ error: "קוד לא נכון" });
    }

    if (!user.codeExpiresAt || user.codeExpiresAt < new Date()) {
      return res.status(400).json({ error: "הקוד פג תוקף" });
    }

    user.code = undefined;
    user.codeExpiresAt = undefined;
    await user.save();

    res.clearCookie("tokenCode", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    const loginToken = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        userName: user.userName,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "4h" }
    );

    res.cookie("adminToken", loginToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 4 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      message: "התחברת בהצלחה!",
      user: {
        _id: user._id,
        role: user.role,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};

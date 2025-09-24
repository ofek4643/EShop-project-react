import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("❌ חסרים משתני סביבה EMAIL_USER / EMAIL_PASS");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"EShop 📩" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ מייל נשלח בהצלחה:", info.messageId);
    return info;
  } catch (error: any) {
    console.error("❌ שגיאה בשליחת מייל:", error.message || error);
    throw new Error("שליחת האימייל נכשלה");
  }
}

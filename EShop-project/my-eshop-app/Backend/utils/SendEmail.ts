import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    console.log(
      "📧 EMAIL_USER:",
      process.env.EMAIL_USER ? "******" : "לא מוגדר"
    );
    console.log(
      "📧 EMAIL_PASS:",
      process.env.EMAIL_PASS ? "******" : "לא מוגדר"
    );

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
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
    console.error("❌ שגיאה בשליחת מייל:", error);
    throw new Error("שליחת האימייל נכשלה");
  }
}

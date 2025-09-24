import nodemailer from "nodemailer";

// פונקציה כללית לשליחת מיילים
export async function sendEmail(to: string, subject: string, html: string) {
  try {
    console.log("📧 שולח מייל ל:", to);
    console.log("📧 נושא:", subject);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // פורט SSL
      secure: true, // חובה עבור פורט 465
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

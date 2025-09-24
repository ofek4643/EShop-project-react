import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const msg = {
      to,
      from: process.env.EMAIL_USER!, // צריך להיות Verified Sender ב-SendGrid
      subject,
      html,
    };
    const result = await sgMail.send(msg);
    console.log("✅ מייל נשלח בהצלחה:", result);
    return result;
  } catch (error) {
    console.error("❌ שגיאה בשליחת מייל:", error);
    throw new Error("שליחת המייל נכשלה");
  }
}

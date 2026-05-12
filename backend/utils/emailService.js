const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendBudgetAlertEmail = async (
  userEmail,
  category,
  spent,
  budget
) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Budget Alert - ${category} Category Exceeded`,
      html: `
        <h2>Budget Threshold Reached</h2>
        <p>Your <strong>${category}</strong> expenses exceeded your set budget.</p>
        <p><strong>Budget:</strong> Rs ${budget}</p>
        <p><strong>Spent:</strong> Rs ${spent}</p>
        <p>Please review your spending to stay financially balanced.</p>
      `,
    });
    console.log("Sending email to:", userEmail);
    console.log("Budget alert email sent successfully");
  } catch (error) {
    console.log("Email sending failed:", error.message);
  }
};

module.exports = sendBudgetAlertEmail;
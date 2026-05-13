const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Google App Password
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("Email config error:", error);
  } else {
    console.log("Email server is ready");
  }
});

const sendBudgetAlert = async (to, category, spent, budget) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: `Budget Alert for ${category}`,
      text: `You have exceeded your ${category} budget.\n\nBudget: Rs ${budget}\nSpent: Rs ${spent}`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.response);
  } catch (error) {
    console.log("Email sending failed:", error.message);
  }
};

module.exports = sendBudgetAlert;
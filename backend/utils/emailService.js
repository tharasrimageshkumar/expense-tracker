const axios = require("axios");
require("dotenv").config();

const useApiMail =
  process.env.NODE_ENV === "production" ||
  process.env.API_MAIL_ACTIVE === "true";

const sendBudgetAlert = async (to, category, spent, budget) => {
  const subject = `Budget Alert for ${category}`;
  const message = `You have exceeded your ${category} budget.\n\nBudget: Rs ${budget}\nSpent: Rs ${spent}`;

  try {
    if (useApiMail) {
      const response = await axios.post(
        process.env.MAIL_SERVER_ENDPOINT,
        {
          to,
          subject,
          html: `
            <h2>Budget Alert</h2>
            <p>You have exceeded your <strong>${category}</strong> budget.</p>
            <p><strong>Budget:</strong> Rs ${budget}</p>
            <p><strong>Spent:</strong> Rs ${spent}</p>
          `,
          text: message,
          from: process.env.EMAIL_USER,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.MAIL_SERVER_API}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Promailer email sent:", response.data);
    } else {
      console.log(
        "API mail inactive. Set API_MAIL_ACTIVE=true for production email sending."
      );
    }
  } catch (error) {
    console.log(
      "Email sending failed:",
      error.response?.data || error.message
    );
  }
};

module.exports = sendBudgetAlert;
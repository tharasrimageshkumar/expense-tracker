const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

router.get("/:userId", async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.params.userId });

    if (expenses.length === 0) {
      return res.json({
        prediction: 0,
        topCategory: "None",
        advice: "Start tracking expenses to unlock AI insights.",
        anomaly: "No unusual expenses detected.",
      });
    }

    // Category totals
    const categoryTotals = {};

    let totalSpent = 0;

    expenses.forEach((expense) => {
      totalSpent += Number(expense.amount);

      categoryTotals[expense.category] =
        (categoryTotals[expense.category] || 0) +
        Number(expense.amount);
    });

    // Top category
    let topCategory = "None";
    let highest = 0;

    for (const category in categoryTotals) {
      if (categoryTotals[category] > highest) {
        highest = categoryTotals[category];
        topCategory = category;
      }
    }

    // ML Prediction (simple average)
    const prediction = (totalSpent / expenses.length) * 30;

    // AI Advice
    let advice = "Your spending looks balanced.";

    if (topCategory === "Shopping") {
      advice =
        "Shopping is your highest expense. Consider setting stricter purchase limits.";
    } else if (topCategory === "Food") {
      advice =
        "Food expenses are high. Reducing dining out could improve savings.";
    } else if (topCategory === "Transport") {
      advice =
        "Transport costs are dominant. Consider optimized travel planning.";
    }

    // Anomaly Detection
    const averageExpense = totalSpent / expenses.length;

    const unusualExpense = expenses.find(
      (expense) => Number(expense.amount) > averageExpense * 2
    );

    const anomaly = unusualExpense
      ? `Unusual spending detected: Rs ${unusualExpense.amount} on ${unusualExpense.title}`
      : "No unusual expenses detected.";

    res.json({
      prediction: prediction.toFixed(2),
      topCategory,
      advice,
      anomaly,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
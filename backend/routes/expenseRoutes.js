const express = require("express");
const router = express.Router();

const Expense = require("../models/Expense");
const Budget = require("../models/Budget");
const User = require("../models/User");
const sendBudgetAlert = require("../utils/emailService");


// =========================
// ADD EXPENSE
// =========================
router.post("/add", async (req, res) => {
  try {
    const { userId, title, amount, category, date } = req.body;
    const finalAmount = Math.round(Number(amount));
    console.log("Incoming Expense:", req.body);

    const expense = new Expense({
      userId,
      title,
      amount: finalAmount,
      category,
      date,
    });

    await expense.save();

    // =========================
    // CHECK BUDGET THRESHOLD
    // =========================
    const budget = await Budget.findOne({
      userId,
      category,
    });
    console.log("Budget found:", budget);

    if (budget) {
      const categoryExpenses = await Expense.find({
        userId,
        category,
      });

      const totalSpent = categoryExpenses.reduce(
        (sum, item) => sum + Number(item.amount),
        0
      );

      if (totalSpent > Number(budget.amount)) {
        const user = await User.findById(userId);

        if (user && user.email) {
          await sendBudgetAlertEmail(
            user.email,
            category,
            totalSpent,
            budget.amount
          );
        }
      }
    }

    res.status(201).json({
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
  console.log("Expense Add Route Error:", error);
  res.status(500).json({
    message: "Server Error",
    error: error.message,
  });
}
});


// =========================
// GET USER EXPENSES
// =========================
router.get("/:userId", async (req, res) => {
  try {
    const expenses = await Expense.find({
      userId: req.params.userId,
    }).sort({ date: -1 });

    res.status(200).json(expenses);
  } catch (error) {
  console.log("Expense Add Route Error:", error);
  res.status(500).json({
    message: "Server Error",
    error: error.message,
  });
}
});


// =========================
// DELETE EXPENSE
// =========================
router.delete("/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
  console.log("Expense Add Route Error:", error);
  res.status(500).json({
    message: "Server Error",
    error: error.message,
  });
}
});


// =========================
// UPDATE EXPENSE
// =========================
router.put("/:id", async (req, res) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedExpense);
  } catch (error) {
  console.log("Expense Add Route Error:", error);
  res.status(500).json({
    message: "Server Error",
    error: error.message,
  });
}
});

module.exports = router;
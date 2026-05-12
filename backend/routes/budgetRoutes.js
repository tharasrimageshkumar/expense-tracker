const express = require("express");
const router = express.Router();
const Budget = require("../models/Budget");

// SET / UPDATE BUDGET
router.post("/set", async (req, res) => {
  try {
    const { userId, category, amount } = req.body;

    let budget = await Budget.findOne({ userId, category });

    if (budget) {
      budget.amount = amount;
      await budget.save();
    } else {
      budget = new Budget({
        userId,
        category,
        amount,
      });

      await budget.save();
    }

    res.status(200).json({
      message: "Budget saved successfully",
      budget,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET USER BUDGETS
router.get("/:userId", async (req, res) => {
  try {
    const budgets = await Budget.find({
      userId: req.params.userId,
    });

    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
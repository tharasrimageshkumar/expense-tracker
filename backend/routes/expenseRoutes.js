const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

router.post("/add", async (req, res) => {
  try {
    const { title, amount, category, date, userId } = req.body;

    const expense = await Expense.create({
  title,
  amount,
  category,
  date,
  userId,
});

    res.status(201).json({
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const expenses = await Expense.find({
      userId: req.params.userId,
    });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        title,
        amount,
        category,
        date,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Expense updated successfully",
      updatedExpense,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
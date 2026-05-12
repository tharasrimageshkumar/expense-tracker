import { useState } from "react";
import API from "../services/api";

function ExpenseForm() {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddExpense = async () => {
  if (!user) {
    alert("Please login first");
    return;
  }

  try {
    const res = await API.post("/expenses/add", {
      ...formData,
      amount: Math.round(Number(formData.amount)),
      userId: user._id,
    });

    console.log("Expense Add Response:", res.data);

    if (res.status === 201 || res.status === 200) {
      alert("Expense added successfully!");

      setFormData({
        title: "",
        amount: "",
        category: "Food",
        date: "",
      });

      window.location.reload();
    }
  } catch (error) {
    console.log("Add Expense Error:", error.response?.data || error.message);
    alert("Failed to add expense");
  }
};

  return (
    <div style={styles.form}>
      <div style={styles.formGroup}>
        <label>Description</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label>Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          style={styles.input}
        >
          <option>Food</option>
          <option>Transport</option>
          <option>Shopping</option>
          <option>Bills</option>
          <option>Other</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label>Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <button style={styles.button} onClick={handleAddExpense}>
        Add Expense
      </button>
    </div>
  );
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    maxWidth: "400px",
    marginTop: "20px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  input: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
  },

  button: {
    padding: "12px",
    background: "#6d28d9",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
  },
};

export default ExpenseForm;
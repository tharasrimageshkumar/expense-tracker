import { useEffect, useState } from "react";
import API from "../services/api";

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [editForm, setEditForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!user) return;

      try {
        const res = await API.get(`/expenses/${user._id}`);
        setExpenses(res.data);
      } catch (error) {
        console.log("Error fetching expenses");
      }
    };

    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
  try {
    await API.delete(`/expenses/${id}`);

    alert("Expense deleted successfully!");

    window.location.reload();
  } catch (error) {
    console.log("Error deleting expense:", error);
  }
};

  const handleEditClick = (expense) => {
    setEditingId(expense._id);

    setEditForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date.split("T")[0],
    });
  };

  const handleUpdate = async (id) => {
    try {
      await API.put(`/expenses/${id}`, editForm);

      alert("Expense updated successfully");

      setEditingId(null);

      window.location.reload();
    } catch (error) {
      alert("Failed to update expense");
    }
  };

  if (!user) {
    return <h3>Please login to view expenses</h3>;
  }

  const filteredExpenses = expenses.filter((expense) => {
    const categoryMatch =
      filter === "All" || expense.category === filter;

    const searchMatch = expense.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return categoryMatch && searchMatch;
  });

  return (
    <div style={styles.container}>
      <div style={styles.filterContainer}>
        <label>Filter by Category: </label>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={styles.filterSelect}
        >
          <option>All</option>
          <option>Food</option>
          <option>Transport</option>
          <option>Shopping</option>
          <option>Bills</option>
          <option>Other</option>
        </select>
      </div>

      <input
        type="text"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchInput}
      />

      {filteredExpenses.length === 0 ? (
        <p>No expenses found</p>
      ) : (
        filteredExpenses.map((expense) => (
          <div key={expense._id} style={styles.card}>
            {editingId === expense._id ? (
              <div style={styles.editContainer}>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      title: e.target.value,
                    })
                  }
                  style={styles.input}
                />

                <input
                  type="number"
                  value={editForm.amount}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      amount: e.target.value,
                    })
                  }
                  style={styles.input}
                />

                <select
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      category: e.target.value,
                    })
                  }
                  style={styles.input}
                >
                  <option>Food</option>
                  <option>Transport</option>
                  <option>Shopping</option>
                  <option>Bills</option>
                  <option>Other</option>
                </select>

                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      date: e.target.value,
                    })
                  }
                  style={styles.input}
                />

                <button
                  style={styles.saveBtn}
                  onClick={() => handleUpdate(expense._id)}
                >
                  Save
                </button>
              </div>
            ) : (
              <>
                <div>
                  <h4 style={styles.title}>{expense.title}</h4>

                  <p style={styles.details}>
                    {expense.category} |{" "}
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>

                <div style={styles.rightSection}>
                  <div style={styles.amount}>
                    Rs {expense.amount}
                  </div>

                  <div style={styles.buttonGroup}>
                    <button
                      style={styles.editBtn}
                      onClick={() => handleEditClick(expense)}
                    >
                      Edit
                    </button>

                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDelete(expense._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "20px",
  },

  filterContainer: {
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  filterSelect: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },

  searchInput: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "15px",
    width: "250px",
  },

  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fafafa",
  },

  title: {
    margin: 0,
    fontSize: "18px",
  },

  details: {
    margin: "5px 0 0",
    color: "#666",
    fontSize: "14px",
  },

  rightSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "8px",
  },

  amount: {
    fontWeight: "bold",
    color: "#6d28d9",
    fontSize: "18px",
  },

  buttonGroup: {
    display: "flex",
    gap: "8px",
  },

  editBtn: {
    padding: "6px 10px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  deleteBtn: {
    padding: "6px 10px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  saveBtn: {
    padding: "8px 12px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  editContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    width: "100%",
  },

  input: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
};

export default ExpenseList;
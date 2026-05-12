import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function Home() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [totalSpent, setTotalSpent] = useState(0);

  const [categoryTotals, setCategoryTotals] = useState({
    Food: 0,
    Transport: 0,
    Shopping: 0,
    Bills: 0,
    Other: 0,
  });

  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [topCategory, setTopCategory] = useState("None");


const [budgetCategory, setBudgetCategory] = useState("");
const [budgetAmount, setBudgetAmount] = useState("");

  const [budgetLimits, setBudgetLimits] = useState({
  Food: 0,
  Transport: 0,
  Shopping: 0,
  Bills: 0,
  Other: 0,
});

  useEffect(() => {
  const fetchExpenses = async () => {
    try {
      const res = await API.get(`/expenses/${user._id}`);

      const total = res.data.reduce(
        (sum, expense) => sum + Number(expense.amount),
        0
      );

      setTotalSpent(total);

      const categoryData = {
        Food: 0,
        Transport: 0,
        Shopping: 0,
        Bills: 0,
        Other: 0,
      };

      res.data.forEach((expense) => {
        if (categoryData[expense.category] !== undefined) {
          categoryData[expense.category] += Number(expense.amount);
        }
      });

      setCategoryTotals(categoryData);

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const monthlyExpenses = res.data.filter((expense) => {
        const expenseDate = new Date(expense.date);

        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      });

      const monthlySum = monthlyExpenses.reduce(
        (sum, expense) => sum + Number(expense.amount),
        0
      );

      setMonthlyTotal(monthlySum);
      setMonthlyCount(monthlyExpenses.length);

      let highestCategory = "None";
      let highestValue = 0;

      for (const category in categoryData) {
        if (categoryData[category] > highestValue) {
          highestValue = categoryData[category];
          highestCategory = category;
        }
      }

      setTopCategory(highestCategory);

      const budgetRes = await API.get(`/budgets/${user._id}`);

      const updatedBudgets = {
        Food: 0,
        Transport: 0,
        Shopping: 0,
        Bills: 0,
        Other: 0,
      };

      budgetRes.data.forEach((budget) => {
        updatedBudgets[budget.category] = Number(budget.amount);
      });

      setBudgetLimits(updatedBudgets);
    } catch (error) {
      console.log("Error fetching dashboard data:", error);
    }
  };

  if (user) {
    fetchExpenses();
  }
}, []);


  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleBudgetSubmit = async (e) => {
  e.preventDefault();

  try {
    await API.post("/budgets/set", {
      userId: user._id,
      category: budgetCategory,
      amount: budgetAmount,
    });

    setBudgetLimits((prev) => ({
  ...prev,
  [budgetCategory]: Number(budgetAmount),
}));

    alert("Budget saved successfully!");

    setBudgetCategory("");
    setBudgetAmount("");
  } catch (error) {
    console.log("Error saving budget:", error);
  }
};

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Expense Tracker</h1>
        </div>

        <div style={styles.headerRight}>
          <span>Welcome, {user.name}!</span>

          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Total Spent */}
      <div style={styles.totalCard}>
        <span>Total Spent:</span>
        <strong>Rs {totalSpent.toFixed(2)}</strong>
      </div>

      {/* Set Budget */}
<section style={styles.section}>
  <h2>Set Category Budget</h2>

  <form onSubmit={handleBudgetSubmit} style={styles.form}>
    <select
      value={budgetCategory}
      onChange={(e) => setBudgetCategory(e.target.value)}
      required
      style={styles.input}
    >
      <option value="">Select Category</option>
      <option value="Food">Food</option>
      <option value="Transport">Transport</option>
      <option value="Shopping">Shopping</option>
      <option value="Bills">Bills</option>
      <option value="Other">Other</option>
    </select>

    <input
      type="number"
      placeholder="Enter Budget Amount"
      value={budgetAmount}
      onChange={(e) => setBudgetAmount(e.target.value)}
      required
      style={styles.input}
    />

    <button type="submit" style={styles.saveBtn}>
      Save Budget
    </button>
  </form>
</section>

      {/* Budget Overview */}
      <section style={styles.section}>
        <h2>Budget Overview</h2>

        <div style={styles.budgetGrid}>
          {["Food", "Transport", "Shopping", "Bills", "Other"].map(
            (category) => (
              <div key={category} style={styles.budgetCard}>
                <h4>{category}</h4>

                <p>Budget: Rs {budgetLimits[category]}</p>

                <p>Spent: Rs {categoryTotals[category]}</p>

                <p>
                  Remaining: Rs{" "}
                  {(budgetLimits[category] - categoryTotals[category]).toFixed(
                    2
                  )}
                </p>
              </div>
            )
          )}
        </div>
      </section>

      {/* Add Expense */}
      <section style={styles.section}>
        <h2>Add New Expense</h2>
        <ExpenseForm />
      </section>

      {/* Recent Expenses */}
      <section style={styles.section}>
        <h2>Recent Expenses</h2>
        <ExpenseList />
      </section>

      {/* Analytics */}
      <section style={styles.section}>
        <h2>Expense Analytics</h2>

        <div style={styles.analyticsGrid}>
          <div style={styles.analyticsCard}>
            <h4>Monthly Spending Trends</h4>
            <p>Total This Month: Rs {monthlyTotal.toFixed(2)}</p>
            <p>Expenses Added: {monthlyCount}</p>
          </div>

          <div style={styles.analyticsCard}>
            <h4>Category-wise Spending</h4>
            <p>Highest Spending Category:</p>
            <strong>{topCategory}</strong>
          </div>
        </div>
      </section>

     
    </div>
  );
}

const styles = {

  form: {
  display: "flex",
  gap: "15px",
  flexWrap: "wrap",
  marginTop: "15px",
},

input: {
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  minWidth: "200px",
},

saveBtn: {
  padding: "10px 18px",
  background: "#16a34a",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
},
  page: {
    background: "#f3f4f6",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
  },

  title: {
    margin: 0,
  },

  headerRight: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },

  logoutBtn: {
    padding: "8px 12px",
    background: "#6d28d9",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  totalCard: {
    background: "#fff",
    padding: "15px 20px",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
    fontSize: "18px",
  },

  section: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
  },

  budgetGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "15px",
    marginTop: "15px",
  },

  budgetCard: {
    border: "1px solid #ddd",
    padding: "15px",
    borderRadius: "8px",
    background: "#fafafa",
  },

  analyticsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginTop: "15px",
  },

  analyticsCard: {
    border: "1px solid #ddd",
    padding: "20px",
    borderRadius: "8px",
    minHeight: "150px",
    background: "#fafafa",
  },
};

export default Home;
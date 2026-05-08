import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      const res = await API.post("/users/login", formData);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login successful");

      navigate("/home");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome Back!</h1>
        <p style={styles.subtitle}>Sign in to manage your expenses</p>

        <div style={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            style={styles.input}
            onChange={handleChange}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            style={styles.input}
            onChange={handleChange}
          />
        </div>

        <button style={styles.button} onClick={handleLogin}>
          Sign In
        </button>

        <hr style={styles.hr} />

        <p style={styles.footerText}>
          Don’t have an account?
        </p>

        <p
          style={styles.link}
          onClick={() => navigate("/register")}
        >
          Create Account
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #6d28d9, #7c3aed)",
    fontFamily: "Arial, sans-serif",
  },

  card: {
    background: "#fff",
    padding: "40px 35px",
    borderRadius: "12px",
    width: "350px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    textAlign: "center",
  },

  title: {
    color: "#6d28d9",
    marginBottom: "10px",
    fontSize: "32px",
  },

  subtitle: {
    color: "#666",
    marginBottom: "30px",
    fontSize: "14px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    marginBottom: "18px",
    fontSize: "14px",
    color: "#333",
  },

  input: {
    marginTop: "8px",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#6d28d9",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px",
    fontWeight: "bold",
  },

  hr: {
    margin: "25px 0 15px",
    border: "none",
    borderTop: "1px solid #ddd",
  },

  footerText: {
    color: "#666",
    fontSize: "14px",
    marginBottom: "8px",
  },

  link: {
    color: "#6d28d9",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  },
};

export default Login;
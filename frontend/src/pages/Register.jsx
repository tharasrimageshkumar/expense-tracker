import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
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

  const handleRegister = async () => {
    try {
      const res = await API.post("/users/register", formData);

      alert("User registered successfully");

      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Sign up to start managing expenses</p>

        <div style={styles.formGroup}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            style={styles.input}
            onChange={handleChange}
          />
        </div>

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

        <button style={styles.button} onClick={handleRegister}>
          Register
        </button>

        <hr style={styles.hr} />

        <p style={styles.footerText}>
          Already have an account?
        </p>

        <p
          style={styles.link}
          onClick={() => navigate("/login")}
        >
          Sign In
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
    fontSize: "30px",
  },

  subtitle: {
    color: "#666",
    marginBottom: "25px",
    fontSize: "14px",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    marginBottom: "15px",
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

export default Register;
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <h2 style={{ cursor: "pointer" }} onClick={() => navigate("/home")}>
        Expense Tracker
      </h2>

      <div>
        {!user ? (
          <>
            <button style={styles.button} onClick={() => navigate("/login")}>
              Login
            </button>

            <button style={styles.button} onClick={() => navigate("/register")}>
              Register
            </button>
          </>
        ) : (
          <button style={styles.button} onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 30px",
    background: "#222",
    color: "#fff",
  },
  button: {
    marginLeft: "10px",
    padding: "8px 12px",
    cursor: "pointer",
  },
};

export default Navbar;
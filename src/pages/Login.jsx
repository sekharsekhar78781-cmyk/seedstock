
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (
      email === "admin@gmail.com" &&
      password === "admin123"
    ) {
      localStorage.setItem("isLoggedIn", "true");
      setError("");
      navigate("/dashboard", { replace: true });
    } else {
      setError("Invalid email or password");
    }
  };
  

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Seeds Stock Management</h2>
        <p>Login to your account</p>

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Login</button>
        
        <div className="login-demo-info">
          <br/>
  
  <span>Email: admin@gmail.com</span>
  <span>Password: admin123</span>
</div>

      </form>
    </div>
  );
}

export default Login;

/* eslint-disable */
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();

  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loggingIn,    setLoggingIn]    = useState(false);

  const login = async () => {
    if (!email || !password) { alert("Please enter email and password."); return; }
    setLoggingIn(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });

      // ✅ CRITICAL FIX: store token
      localStorage.setItem("token", res.data.token);

      const u = res.data.user || {};

      // ✅ CRITICAL FIX: store _id so RegistrationContext and MyRegistrations
      //    can look up the student's registrations by ID
      const finalUser = {
        _id:   u.id   || u._id  || "",   // <-- THIS was missing before
        id:    u.id   || u._id  || "",   // keep both for compatibility
        name:  u.name || u.fullname || u.fullName || u.username || email.split("@")[0],
        email: u.email || email,
        role:  res.data.role || u.role || "organizer",
      };

      localStorage.setItem("user", JSON.stringify(finalUser));

      if (finalUser.role === "student")       navigate("/student/dashboard");
      else if (finalUser.role === "admin")    navigate("/admin/dashboard");
      else                                    navigate("/organizer/dashboard");

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Invalid login credentials.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") login(); };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Campus Event Login</h2>

        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKey}
        />

        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKey}
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button className="auth-btn" onClick={login} disabled={loggingIn}>
          {loggingIn ? "Logging in…" : "Login"}
        </button>

        <div className="auth-line">OR</div>

        <span onClick={() => navigate("/forgot-password")} className="auth-link">
          Forgot Password?
        </span>

        <span onClick={() => navigate("/signup")} className="auth-link">
          Don't have an account? Signup
        </span>
      </div>
    </div>
  );
}

export default Login;

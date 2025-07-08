import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/api";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/register", { username, password });
      // Optionally, auto-login after signup:
      const res = await axios.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      navigate("/notes");
    } catch (err) {
      alert("Signup failed: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
        <p onClick={() => navigate("/login")}>Already have an account? Login</p>
      </form>
    </div>
  );
};

export default SignupPage;

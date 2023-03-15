import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.css";

function Login() {
  const [role, setRole] = useState("Company");
  const [inviteCode, setInviteCode] = useState("");
  const [isCodeActivated, setIsCodeActivated] = useState(false); // new state variable
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (role === "Company") {
      navigate("/company");
    } else if (role === "Admin") {
      navigate("/admin");
    }
  };

  const handleInviteCode = () => {
    // Check if invite code is valid and activate it if so
    // Display message with deadline for training
    setIsCodeActivated(true); // set isCodeActivated state to true
  };

  return (
    <div className="login">
      <div className="login__container">
        <select
          className="login__roleSelect"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="Company">Company</option>
          <option value="Admin">Admin</option>
        </select>
        <div className="login__inviteCode">
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="Enter Invite Code"
          />
          <button onClick={handleInviteCode}>Activate</button>
        </div>
        {isCodeActivated ? (
          <button className="login__btn" onClick={handleLogin}>
            Login
          </button>
        ) : (
          <p className="login__msg">
            Please enter a valid invite code to activate login.
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;

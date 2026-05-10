import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import "./css/PatientLogin.css"

const PatientLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const { setToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/auth/patientlogin", {
                email: email,
                password: password,
            });
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("blockchainAddress", response.data.decryptedAddress);
            localStorage.setItem("patientEmail", email);
            navigate("/patient-dashboard");
        } catch (error) {
            console.error("Authentication failed:", error);
            setToken(null);
            localStorage.removeItem("token");
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="login-container">
          <h2 className="login-title">Patient Login</h2>
          <p className="login-description">Welcome back! Please login to access your account.</p>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <div className="login-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  className="login-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  className="login-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>
              <button className="login-button" type="submit">Login</button>
            </form>
          </div>
        </div>
      );
};

export default PatientLogin;

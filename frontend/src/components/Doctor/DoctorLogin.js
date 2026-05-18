import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { getWallet } from "../../utils/wallet";
import "./css/DoctorLogin.css";

const DoctorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoggingIn(true);
    
    // Clear patient session leftovers
    localStorage.removeItem("patientEmail");
    localStorage.removeItem("patientName");
    localStorage.removeItem("patientAddress");

    try {
      // Attempt to get wallet address but do not block login
      let walletAddr = null;
      try {
        const { address } = await getWallet(true);
        walletAddr = address;
      } catch (err) {
        console.warn('Wallet not connected during doctor login:', err?.message || err);
      }

      const response = await axios.post("/api/auth/doctorlogin", { email, password });
      if (response.data?.token) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
      }
      const addr = response.data?.decryptedAddress || walletAddr;
      if (addr) {
        localStorage.setItem("blockchainAddress", addr);
        localStorage.setItem("doctorAddress", addr);
      }
      localStorage.setItem("doctorEmail", email);
      if (response.data?.name) localStorage.setItem("doctorName", response.data.name);

      navigate("/doctor-dashboard");
    } catch (error) {
      console.error("Authentication failed:", error);
      setToken(null);
      localStorage.removeItem("token");
      const errorMessage =
          error?.reason ||
          error?.data?.message ||
          error?.error?.message ||
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Authentication failed. Please check your credentials and try again.";
      setMessage(errorMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="dashboard-container" style={{ minHeight: '80vh' }}>
      <div className="dashboard-main">
        <div className="welcome-section">
          <h1>Doctor Login</h1>
          <p className="login-description">Welcome back — connect your wallet to manage patients.</p>
        </div>

        <div className="tab-content" style={{ maxWidth: 520 }}>
          {message && <div className="request-card" style={{ marginBottom: 12 }}>{message}</div>}
          <form onSubmit={handleSubmit}>
            <label>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required disabled={isLoggingIn} />

            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required disabled={isLoggingIn} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="submit" className="btn-success" disabled={isLoggingIn}>{isLoggingIn ? 'Logging in...' : 'Login'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;

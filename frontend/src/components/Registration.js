import React, { useState } from "react";
import axios from "axios";
import "./css/Registration.css"

const Registration = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/register", {
        name:"harsh",
        email:"test@gmail.com",
        blockchainAddress: "12345678"
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error("Registration failed:", error.response.data.error);
      setMessage(error.response.data.error);
    }
  };

  return (
    <div className="registration-container">
      <h2 className="registration-title">Register</h2>
      <form className="registration-form" onSubmit={handleSubmit}>
        <input
          className="registration-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          className="registration-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button className="registration-button" type="submit">
          Register
        </button>
      </form>
      {message && <p className="registration-message">{message}</p>}
    </div>
  );
};

export default Registration;

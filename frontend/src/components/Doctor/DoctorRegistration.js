import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getWallet } from "../../utils/wallet";
import config from "../../utils/smartContract";
import "./css/DoctorRegistration.css";

const contractABI = config.contractABI;
const contractAddress = config.contractAddress;

const DoctorRegistration = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [DateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [addressField, setAddressField] = useState("");
  const [message, setMessage] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsRegistering(true);
    try {
      const { signer, address } = await getWallet(true);

      // Doctor on-chain registration
      try {
        const { ethers } = await import("ethers");
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const name = `${firstName} ${lastName}`.trim();
        const tx = await contract.connect(signer).registerDoctor(name);
        await tx.wait();
      } catch (chainErr) {
        console.warn("On-chain doctor registration failed:", chainErr?.message || chainErr);
      }

      // Send registration to backend
      const response = await axios.post('/api/auth/doctorRegistration', {
        email,
        password,
        FirstName: firstName,
        LastName: lastName,
        Gender: gender,
        DateOfBirth: DateOfBirth,
        Specialization: specialization,
        address: addressField,
        blockchainAddress: address,
      });

      setMessage("Registration successful. Redirecting to login...");
      // Store blockchain address returned from backend (decrypted) or from wallet as fallback
      localStorage.setItem(
          "blockchainAddress",
          response.data?.decryptedAddress || address
      ); 
      
      setTimeout(() => navigate('/doctor-login'), 1200);
    } catch (error) {
      console.error("Doctor registration error:", error);
      const errMsg = error?.response?.data?.error || error?.message || "Registration failed.";
      setMessage(errMsg);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="dashboard-container registration-page">
      <div className="dashboard-main">
        <div className="welcome-section">
          <h1>Doctor Registration</h1>
          <p>Register your account and connect your wallet to manage patients.</p>
        </div>

        <div className="tab-content" style={{ maxWidth: 720 }}>
          {message && <div className="request-card" style={{ marginBottom: 16 }}>{message}</div>}
          <form onSubmit={handleSubmit} className="doctor-form">
            <label>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required disabled={isRegistering} />

            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required minLength={8} disabled={isRegistering} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label>First Name</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" required minLength={2} maxLength={50} pattern="[A-Za-z ]+" autoComplete="given-name" disabled={isRegistering} />
              </div>
              <div>
                <label>Last Name</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" required minLength={2} maxLength={50} pattern="[A-Za-z ]+" autoComplete="family-name" disabled={isRegistering} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label>Date of Birth</label>
                <input type="date" value={DateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required max={new Date().toISOString().split("T")[0]} disabled={isRegistering} />
              </div>
              <div>
                <label>Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} required disabled={isRegistering}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <label>Specialization</label>
            <input type="text" value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="Specialization" required minLength={2} maxLength={80} autoComplete="organization-title" disabled={isRegistering} />

            <label>Address</label>
            <input type="text" value={addressField} onChange={(e) => setAddressField(e.target.value)} placeholder="Address" required disabled={isRegistering} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
              <button className="btn-success" type="submit" disabled={isRegistering}>{isRegistering ? 'Registering...' : 'Register'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegistration;

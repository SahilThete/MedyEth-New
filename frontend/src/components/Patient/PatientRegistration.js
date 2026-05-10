 import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import config from "../../utils/smartContract";
import { getWallet } from "../../utils/wallet";
import "./css/PatientRegistration.css";

const contractABI = config.contractABI;
const contractAddress = config.contractAddress;

const PatientRegistration = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [FirstName, setFirstName] = useState("");
    const [LastName, setLastName] = useState("");
    const [Age, setAge] = useState("");
    const [Gender, setGender] = useState("");
    const [Weight, setWeight] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [message, setMessage] = useState("");
    const { setToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsRegistering(true);
        try {
            const { provider, signer, address } = await getWallet();

            // Register patient on-chain
            try {
                const ethers = await import("ethers");
                const contract = new ethers.Contract(contractAddress, contractABI, provider);
                const name = `${FirstName} ${LastName}`.trim();
                const tx = await contract.connect(signer).registerPatient(name);
                await tx.wait();
            } catch (chainErr) {
                console.warn("On-chain registration failed:", chainErr?.message || chainErr);
                // Not fatal for off-chain user creation; continue
            }

            // Call backend registration
            const response = await axios.post("/api/auth/patientRegistration", {
                email,
                password,
                FirstName,
                LastName,
                Gender,
                Age,
                Weight,
                blockchainAddress: address,
            });

            setMessage("Registration successful. Redirecting to dashboard...");
            // Backend may or may not return token on registration; try to set if present
            if (response.data?.token) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
            }
            if (response.data?.decryptedAddress) {
                localStorage.setItem("blockchainAddress", response.data.decryptedAddress);
            } else if (address) {
                localStorage.setItem("blockchainAddress", address);
            }

            setTimeout(() => navigate("/dashboard"), 900);
        } catch (error) {
            console.error("Registration failed:", error);
            const errMsg = error?.response?.data?.error || error?.message || "Registration failed.";
            setMessage(errMsg);
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <div className="dashboard-container registration-page">
            <div className="nav-container" style={{ paddingTop: "2rem" }}>
                <div className="nav-brand">MedyEth</div>
            </div>

            <div className="dashboard-main">
                <div className="welcome-section">
                    <h1>Patient Registration</h1>
                    <p>Create your account and connect your wallet to manage access to your records.</p>
                </div>

                <div className="tab-content" style={{ maxWidth: 720 }}>
                    {message && <div className="request-card" style={{ marginBottom: 16 }}>{message}</div>}

                    <form onSubmit={handleSubmit} className="patient-form">
                        <label>Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required disabled={isRegistering} />

                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required disabled={isRegistering} />

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <div>
                                <label>First Name</label>
                                <input type="text" value={FirstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" required disabled={isRegistering} />
                            </div>
                            <div>
                                <label>Last Name</label>
                                <input type="text" value={LastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" required disabled={isRegistering} />
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <div>
                                <label>Age</label>
                                <input type="number" value={Age} onChange={(e) => setAge(e.target.value)} placeholder="Age" required disabled={isRegistering} />
                            </div>
                            <div>
                                <label>Weight</label>
                                <input type="text" value={Weight} onChange={(e) => setWeight(e.target.value)} placeholder="Weight" required disabled={isRegistering} />
                            </div>
                        </div>

                        <label>Gender</label>
                        <select value={Gender} onChange={(e) => setGender(e.target.value)} required disabled={isRegistering}>
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 12 }}>
                            <button type="submit" className="btn-success" disabled={isRegistering}>{isRegistering ? 'Registering...' : 'Register'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PatientRegistration;

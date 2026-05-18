import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getWallet } from "../../utils/wallet";
import config from "../../utils/smartContract";
import "./css/PatientRegistration.css";

const contractABI = config.contractABI;
const contractAddress = config.contractAddress;

const PatientRegistration = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [DateOfBirth, setDateOfBirth] = useState("");
    const [gender, setGender] = useState("");
    const [weight, setWeight] = useState("");
    const [message, setMessage] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsRegistering(true);
        try {
            const { signer, address } = await getWallet(true);

      // Patient on-chain registration
            try {
                const { ethers } = await import("ethers");
                const contract = new ethers.Contract(contractAddress, contractABI, signer);
                const name = `${firstName} ${lastName}`.trim();
                const tx = await contract.connect(signer).registerPatient(name);
                await tx.wait();
            } catch (chainErr) {
                console.warn("On-chain patient registration failed:", chainErr?.message || chainErr);
            }

            // Calculate age from DOB for backend validation
            const dob = new Date(DateOfBirth);
            const today = new Date();
            let calculatedAge = today.getFullYear() - dob.getFullYear();
            const monthDifference = today.getMonth() - dob.getMonth();
            if ( monthDifference < 0 || ( monthDifference === 0 && today.getDate() < dob.getDate())) {
                calculatedAge--;
            }

            // Call backend registration
            const response = await axios.post('/api/auth/patientRegistration', {
                email,
                password,
                FirstName: firstName,
                LastName: lastName,
                Gender: gender,
                DateOfBirth: DateOfBirth,
                Age: calculatedAge,
                Weight: weight,
                blockchainAddress: address,
            });

            setMessage("Registration successful. Redirecting to login...");
            // Store blockchain address returned from backend (decrypted) or from wallet as fallback
            localStorage.setItem(
                "blockchainAddress",
                response.data?.decryptedAddress || address
            );

            setTimeout(() => navigate('/patient-login'), 1200);
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

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <div>
                                <label>Date of Birth</label>
                                <input type="date" value={DateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required max={new Date().toISOString().split("T")[0]} disabled={isRegistering} />
                            </div>
                            <div>
                                <label>Weight</label>
                                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Weight" required min="1" max="500" step="0.1" autoComplete="off" disabled={isRegistering} />
                            </div>
                        </div>

                        <label>Gender</label>
                        <select value={gender} onChange={(e) => setGender(e.target.value)} required disabled={isRegistering}>
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                            <button className="btn-success" type="submit" disabled={isRegistering}>{isRegistering ? 'Registering...' : 'Register'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PatientRegistration;

import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import config from "../../utils/smartContract";
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
    const { setToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Prompt user to connect MetaMask
            if (window.ethereum) {
                await window.ethereum.enable();
            } else {
                throw new Error("MetaMask extension not detected. Please install MetaMask.");
            }

            // Connect to MetaMask provider
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            // Load contract
            const contract = new ethers.Contract(contractAddress, contractABI, provider);

            // Concatenate first name and last name
            const name = FirstName + " " + LastName;

            // Call registerPatient function of smart contract
            try {
                const transaction = await contract.connect(signer).registerPatient(name);
                // Wait for transaction to be mined
                await transaction.wait();
            } catch (error) {
                alert(error.message);
            }




            // Call the given API
            const response = await axios.post("/api/auth/patientRegistration", {
                email: email,
                password: password,
                FirstName: FirstName,
                LastName: LastName,
                Gender: Gender,
                Age: Age,
                Weight: Weight,
                blockchainAddress: await signer.getAddress()
            });
            alert("Registration Successful");
            // Set token and navigate to dashboard
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("blockchainAddress", response.data.blockchainAddress);
            navigate("/dashboard");
        } catch (error) {
            console.error("Registration failed:", error);
            // Handle error and display appropriate message to user
        }
    };

    return (
        <div className="page-container">
            <div className="registration-header">
                <h1 className="page-title">MedyEth Patient Registration</h1>
                <p className="page-description">Register with MedyEth to access healthcare services.</p>
            </div>
            <div className="patient-registration-container">
                <form onSubmit={handleSubmit}>
                <label>Email Address</label>
                <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <label>First Name</label>
                    <input
                        type="text"
                        value={FirstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        required
                    />
                    <label>Last Name</label>
                    <input
                        type="text"
                        value={LastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        required
                    />
                    <label>Age</label>
                    <input
                        type="text"
                        value={Age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Age"
                        required
                    />
                    <label>Gender</label>
                    <input
                        type="text"
                        value={Gender}
                        onChange={(e) => setGender(e.target.value)}
                        placeholder="Gender"
                        required
                    />
                    <label>Weight</label>
                    <input
                        type="text"
                        value={Weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="Weight"
                        required
                    />
                    <button type="submit">
                        <span>Register</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PatientRegistration;

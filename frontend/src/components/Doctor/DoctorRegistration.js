import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { redirect, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import config from "../../utils/smartContract";
import "./css/DoctorRegistration.css";

const contractABI = config.contractABI;
const contractAddress = config.contractAddress;

const DoctorRegistration = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [DateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [Specility, setSpecialization] = useState("");
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
      const name = firstName + " " + lastName;

      // Call registerDoctor function of smart contract
      try {
        const transaction = await contract.connect(signer).registerDoctor(name);
        // Wait for transaction to be mined
        await transaction.wait();
      } catch (error) {
        alert("Doctor is already registered");
      }


      console.log(firstName,
        lastName,
        email,
        password,
        DateOfBirth,
        gender,
        Specility,
        address,
      )
      // Send registration data to the server
      const response = await axios.post("/api/auth/doctorRegistration", {
        FirstName: firstName,
        LastName: lastName,
        email: email,
        password: password,
        DateOfBirth: DateOfBirth,
        Gender: gender,
        Specility: Specility,
        address: address,
        blockchainAddress: await signer.getAddress()
      });
      // Handle success
      console.log("Doctor registration successful:", response.data);
      alert("Registration Successful");
      navigate("/home");
    } catch (error) {
      // Handle error
      console.error("Doctor registration error:", error);
      setErrorMessage(error.response.data.message || "Registration failed");
    }
  };

  return (
    <div className="page-container">
      <div className="registration-header">
        <h1 className="page-title">MedyEth Doctor Registration</h1>
        <p className="page-description">Register with MedyEth to access healthcare services.</p>
      </div>
      <div className="registration-container">
        {errorMessage && <div className="error-message">{errorMessage}</div>}
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
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            required
          />
          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            required
          />
          <label>Date of Birth</label>
          <input
            type="date"
            value={DateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            placeholder="Date of Birth"
            required
          />
          <label>Gender</label>
          <input
            type="text"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            placeholder="Gender"
            required
          />
          <label>Specialization</label>
          <input
            type="text"
            value={Specility}
            onChange={(e) => setSpecialization(e.target.value)}
            placeholder="Specialization"
            required
          />
          <label>Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            required
          />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default DoctorRegistration;

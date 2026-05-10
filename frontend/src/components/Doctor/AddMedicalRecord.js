import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import config from "../../utils/smartContract";
import { getWallet } from '../../utils/wallet';
import "./css/AddMedicalRecord.css"

const contractABI = config.contractABI;
const contractAddress = config.contractAddress;

function AddMedicalRecord() {
    const { patientAddress } = useParams();
    const [data, setData] = useState("");
    const [doctorName, setDoctorName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { signer } = await getWallet();
            const connectedContract = new ethers.Contract(contractAddress, contractABI, signer);

            // Call updatePatientMedicalRecord function

            const transaction = await connectedContract.updatePatientMedicalRecord(patientAddress, data, doctorName);
            // Wait for transaction to be mined
            await transaction.wait();

            // Reset form fields
            setData("");
            setDoctorName("");

            alert("Medical record added successfully!");
        } catch (error) {
            console.error("Error adding medical record:", error);
            alert("An error occurred while adding medical record. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-medical-record-container">
            <h2 className="add-medical-record-title">Add Medical Record</h2>
            <p className="add-medical-record-description">Enter the medical record details below:</p>
            <form onSubmit={handleSubmit} className="add-medical-record-form">
                <label className="add-medical-record-label">
                    Data:
                    <textarea className="add-medical-record-textarea" value={data} onChange={(e) => setData(e.target.value)} required />
                </label>
                <label className="add-medical-record-label">
                    Doctor's Name:
                    <input className="add-medical-record-input" type="text" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} required />
                </label>
                <button className="add-medical-record-button" type="submit" disabled={loading}>{loading ? "Adding..." : "Add Medical Record"}</button>
            </form>
        </div>
    );
}

export default AddMedicalRecord;

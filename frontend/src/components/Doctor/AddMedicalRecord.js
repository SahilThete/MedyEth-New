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
    const [doctorName, setDoctorName] = useState(() => localStorage.getItem('doctorName') || "");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

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
            setMessage('Medical record added successfully.');
        } catch (error) {
            console.error("Error adding medical record:", error);
            setMessage('An error occurred while adding medical record. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-medical-record-container">
            <h2 className="add-medical-record-title">Add Medical Record</h2>
            <p className="add-medical-record-description">Enter the medical record details below:</p>
            <form onSubmit={handleSubmit} className="add-medical-record-form">
                    {message && <div className="request-card" style={{ marginBottom: 12 }}>{message}</div>}
                    <label className="add-medical-record-label">
                        Data:
                        <textarea className="add-medical-record-textarea" value={data} onChange={(e) => setData(e.target.value)} required disabled={loading} />
                    </label>
                    <label className="add-medical-record-label">
                        Doctor's Name:
                        <input className="add-medical-record-input" type="text" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} required disabled={loading} />
                    </label>
                                <button className="btn-success" type="submit" disabled={loading}>
                                    {loading && <span className="btn-spinner" aria-hidden></span>}
                                    <span style={{ marginLeft: loading ? 8 : 0 }}>{loading ? "Adding..." : "Add Medical Record"}</span>
                                </button>
                </form>
        </div>
    );
}

export default AddMedicalRecord;

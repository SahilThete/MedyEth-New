import React, { useEffect, useState, useMemo } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import config from "../../utils/smartContract";
import axios from "axios";
import "./css/DoctorDashboard.css"
import MedicalRecordViewer from "./MedicalRecordViewer"; // Import the component for viewing medical records
import { getWallet } from '../../utils/wallet';

const contractABI = config.contractABI;
const contractAddress = config.contractAddress;
const jsonRpcProviderUrl = config.jsonRpcProviderUrl;
const backendAPIUrl = "/api/auth/RequestPatientViewAccess"; // Replace with your backend API URL

function DoctorDashboard({ account, hospitalAddress }) {
    const [patientNames, setPatientNames] = useState([]);
    const [patientAddresses, setPatientAddresses] = useState([]);
    const [doctorName, setDoctorName] = useState("");
    const [requestedPatientEmail, setrequestedPatientEmail] = useState("");
    const [ethAccount, setethAccount] = useState("");
    const navigate = useNavigate();
    const [isLoadingAuthorized, setIsLoadingAuthorized] = useState(false);
    const [isRequestingAccess, setIsRequestingAccess] = useState(false);

    useEffect(() => {
        // Set doctor name from localStorage if available
        const storedDoctorName = localStorage.getItem("doctorName");
        if (storedDoctorName) {
            setDoctorName(storedDoctorName);
        }

        async function fetchAuthorizedPatients() {
            setIsLoadingAuthorized(true);
            try {
                const { signer, address } = await getWallet();
                const connectedContract = new ethers.Contract(contractAddress, contractABI, signer);
                const [names, addresses] = await connectedContract.viewAuthorizedPatients();

                // Update state with fetched authorized patients
                setPatientNames(names);
                setPatientAddresses(addresses);
                setethAccount(address);
                localStorage.setItem("doctorAddress", address);
            } catch (error) {
                console.error("Error fetching authorized patients:", error);
            } finally {
                setIsLoadingAuthorized(false);
            }
        }

        fetchAuthorizedPatients();
    }, []);

    const viewPatientRecords = async (patientAddress) => {
        // Redirect to MedicalRecordViewer component with patient's address as a parameter
        navigate(`/medical-records/${patientAddress}`);
    };

    const requestAccess = async () => {
        setIsRequestingAccess(true);
        try {
            const doctorName = localStorage.getItem("doctorName");
            const doctorAddress = localStorage.getItem("doctorAddress");

            if (!doctorName || !doctorAddress) {
                alert("Doctor information not found. Please login again.");
                return;
            }

            if (!requestedPatientEmail.trim()) {
                alert("Please enter a patient email.");
                return;
            }

            // Send API request to backend
            console.log("From request api")
            console.log("Doctor Name:", doctorName)
            console.log("Doctor Address:", doctorAddress)
            const response = await axios.post(backendAPIUrl, {
                patientEmail: requestedPatientEmail.trim(),
                doctorName: doctorName,
                doctorBlockchainAddress: doctorAddress,
                hospitalAddress: hospitalAddress,
            });
            console.log(response);
            if (response.status === 200) {
                alert(response.data.message || "Access request sent successfully.");
                setrequestedPatientEmail(""); // Clear the input
            } else {
                alert("Failed to send access request. Please try again later.");
            }
        } catch (error) {
            console.error("Error sending access request:", error);
            const errorMessage = error.response?.data?.error || "An error occurred while sending access request. Please try again later.";
            alert(errorMessage);
        } finally {
            setIsRequestingAccess(false);
        }
    };

    const addMedicalRecord = (patientAddress) => {
        navigate(`/add-medical-record/${patientAddress}`);
    };

    const memoizedPatients = useMemo(() => {
        return (patientNames || []).map((n, i) => ({ name: n, address: patientAddresses[i] }));
    }, [patientNames, patientAddresses]);

    return (
        <div className="doctor-dashboard-container">
            <h2 className="dashboard-title">List of Patients who have granted access:</h2>
            {isLoadingAuthorized ? (
                <p>Loading authorized patients...</p>
            ) : memoizedPatients.length > 0 ? (
                <ul className="patient-list">
                    {memoizedPatients.map((p, index) => (
                        <li className="patient-item">
                            <div className="patient-info">

                                <div className="patient-avatar">
                                {p.name.charAt(0)}
                                </div>

                                <div className="patient-details">
                                <h3>{p.name}</h3>
                                <p>{p.address}</p>
                                </div>

                            </div>

                            <div className="patient-actions">

                                <button
                                className="dashboard-btn dashboard-btn-primary"
                                onClick={() => viewPatientRecords(patientAddresses[index])}
                                >
                                View Records
                                </button>

                                <button
                                className="dashboard-btn dashboard-btn-secondary"
                                onClick={() => addMedicalRecord(patientAddresses[index])}
                                >
                                Add Record
                                </button>

                            </div>

                            </li>
                    ))}
                </ul>
            ) : (
                <p>No patients have granted access.</p>
            )}

            <h2 className="dashboard-title">Request Access</h2>
            <form onSubmit={(e) => { e.preventDefault(); requestAccess(); }} className="access-request-form">
                <label className="input-label">
                    Patient's Email:
                    <input type="text" value={requestedPatientEmail} onChange={(e) => setrequestedPatientEmail(e.target.value)} required disabled={isRequestingAccess} />
                </label>
                <button type="submit" className="request-access-button" disabled={isRequestingAccess}>{isRequestingAccess ? 'Sending...' : 'Request Access'}</button>
            </form>
        </div>
    );
}

export default DoctorDashboard;

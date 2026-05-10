import React, { useEffect, useState, useMemo } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import config from "../../utils/smartContract";
import axios from "axios";
import "./css/DoctorDashboard.css"
import MedicalRecordViewer from "./MedicalRecordViewer"; // Import the component for viewing medical records
import { getWallet, getReadOnlyProvider } from '../../utils/wallet';

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
    const [search, setSearch] = useState("");

    // Set doctor name from localStorage if available
    useEffect(() => {
        const storedDoctorName = localStorage.getItem("doctorName");
        if (storedDoctorName) setDoctorName(storedDoctorName);
    }, []);

    // Fetch authorized patients (extracted so it can be reused by event handlers)
    async function fetchAuthorizedPatients() {
        setIsLoadingAuthorized(true);
        try {
            const { signer, address } = await getWallet();
            const connectedContract = new ethers.Contract(contractAddress, contractABI, signer);
            const [names, addresses] = await connectedContract.viewAuthorizedPatients();

            // Update state with fetched authorized patients
            setPatientNames(names || []);
            setPatientAddresses(addresses || []);
            setethAccount(address);
            localStorage.setItem("doctorAddress", address);
        } catch (error) {
            console.error("Error fetching authorized patients:", error);
        } finally {
            setIsLoadingAuthorized(false);
        }
    }

    useEffect(() => {
        fetchAuthorizedPatients();
    }, []);

    // Listen for DoctorAccessGranted events and refresh when relevant
    useEffect(() => {
        let provider;
        try {
            provider = getReadOnlyProvider(jsonRpcProviderUrl || config.jsonRpcProviderUrl);
        } catch (err) {
            console.warn('Could not create read-only provider for events:', err);
            return;
        }

        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const handler = (patientAddr, doctorAddr) => {
            try {
                const localDoctor = (localStorage.getItem('doctorAddress') || '').toLowerCase();
                if (!localDoctor) return;
                if (String(doctorAddr).toLowerCase() === localDoctor) {
                    // refresh list when this doctor was granted access
                    fetchAuthorizedPatients();
                }
            } catch (e) { console.error('event handler error', e); }
        };

        contract.on('DoctorAccessGranted', handler);
        return () => { try { contract.off('DoctorAccessGranted', handler); } catch (e) {} };
    }, []);

    const viewPatientRecords = async (patientAddress) => {
        // Redirect to MedicalRecordViewer component with patient's address as a parameter
        navigate(`/medical-records/${patientAddress}`);
    };

    const requestAccess = async () => {
        setIsRequestingAccess(true);
        try {
            let doctorName = localStorage.getItem("doctorName");
            let doctorAddress = localStorage.getItem("doctorAddress");

            // Fallback: try to get connected wallet address if localStorage missing
            if (!doctorAddress) {
                try {
                    const { address } = await getWallet();
                    doctorAddress = address;
                    localStorage.setItem('doctorAddress', address);
                } catch (err) {
                    console.warn('Could not retrieve wallet address as fallback:', err?.message || err);
                }
            }

            // If doctorName missing, fall back to Unknown Doctor (backend will sanitize), but try to keep empty string
            if (!doctorName) {
                doctorName = localStorage.getItem('doctorName') || '';
            }

            if (!doctorAddress) {
                alert("Doctor blockchain address not found. Please connect your wallet or login.");
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

    const filteredPatients = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return memoizedPatients;
        return memoizedPatients.filter(p => (p.name || '').toLowerCase().includes(q) || (p.address || '').toLowerCase().includes(q));
    }, [memoizedPatients, search]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('doctorName');
        localStorage.removeItem('doctorAddress');
        window.location.href = '/';
    }

    return (
        <div className="doctor-dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Doctor Dashboard</h1>
                    <div className="dashboard-subtitle">Welcome, {doctorName || 'Doctor'}</div>
                </div>

                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ textAlign: 'right', color: '#64748b', fontSize: 14 }}>
                        <div style={{ fontWeight: 700 }}>{doctorName || '—'}</div>
                        <div style={{ fontFamily: 'monospace', fontSize: 12 }}>{ethAccount}</div>
                    </div>
                    <button className="dashboard-btn dashboard-btn-secondary" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-title">Authorized Patients</div>
                    <div className="stat-value">{memoizedPatients.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-title">Pending Requests</div>
                    <div className="stat-value">—</div>
                </div>
            </div>

            <div className="dashboard-panel">
                <div className="panel-title">Authorized Patients</div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                    <input placeholder="Search by name or address" value={search} onChange={e => setSearch(e.target.value)} style={{ padding: 12, borderRadius: 12, border: '1px solid #e6eef6', width: 360 }} />
                </div>

                {isLoadingAuthorized ? (
                    <div className="request-card">Loading authorized patients...</div>
                ) : filteredPatients.length > 0 ? (
                    <ul className="patient-list">
                        {filteredPatients.map((p, index) => (
                            <li className="patient-item" key={p.address}>
                                <div className="patient-info">
                                    <div className="patient-avatar">{(p.name || 'U').charAt(0)}</div>
                                    <div className="patient-details">
                                        <h3>{p.name}</h3>
                                        <p>{p.address}</p>
                                    </div>
                                </div>

                                <div className="patient-actions">
                                                                        <button className="dashboard-btn dashboard-btn-primary" onClick={() => viewPatientRecords(p.address)} disabled={isLoadingAuthorized}>{/* keep dashboard styles */}
                                                                            {isLoadingAuthorized && <span className="btn-spinner" aria-hidden></span>}
                                                                            <span style={{ marginLeft: isLoadingAuthorized ? 8 : 0 }}>View Records</span>
                                                                        </button>
                                                                        <button className="dashboard-btn dashboard-btn-secondary" onClick={() => addMedicalRecord(p.address)} disabled={isLoadingAuthorized}>Add Record</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="empty-state">
                        <h3>No patients have granted access.</h3>
                        <p>Use the Request Access panel below to ask a patient for permission.</p>
                    </div>
                )}

            </div>

            <div className="dashboard-panel">
                <div className="panel-title">Request Access</div>
                <form onSubmit={(e) => { e.preventDefault(); requestAccess(); }} className="access-request-form">
                    <label className="input-label">Patient's Email:
                        <input type="text" value={requestedPatientEmail} onChange={(e) => setrequestedPatientEmail(e.target.value)} required disabled={isRequestingAccess} />
                    </label>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" className="request-access-button" disabled={isRequestingAccess}>{isRequestingAccess ? 'Sending...' : 'Request Access'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DoctorDashboard;

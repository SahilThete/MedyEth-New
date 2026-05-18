import React, { useEffect, useState, useMemo } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import config from "../../utils/smartContract";
import { getWallet, switchToNetwork } from '../../utils/wallet';
import "./css/PatientDashboard.css"; // Import CSS file for styling
const contractABI = config.contractABI;
const contractAddress = config.contractAddress;
const jsonRpcProviderUrl = config.jsonRpcProviderUrl;

function PatientDashboard() {
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [accessRequests, setAccessRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState({});
    const [isFetchingRecords, setIsFetchingRecords] = useState(false);
    const [isFetchingRequests, setIsFetchingRequests] = useState(false);
    const [message, setMessage] = useState("");
    const [networkPrompt, setNetworkPrompt] = useState({ show: false, expectedChainId: null, pendingDoctorAddress: null, pendingDoctorName: null });
    const [activeTab, setActiveTab] = useState("records");
    const navigate = useNavigate();
    const logout = () => {
        // Remove only application keys instead of clearing all storage
        [
            'token',
            'patientEmail',
            'blockchainAddress',
            'doctorAddress',
            'doctorName',
            'doctorEmail'
        ].forEach(k => localStorage.removeItem(k));
        navigate('/logout');
    }
    useEffect(() => {
        fetchMedicalRecords();
        fetchAccessRequests();
    }, []);

    async function fetchMedicalRecords() {
        setIsFetchingRecords(true);
        try {
            // Use centralized wallet util for signer/provider
            const { signer } = await getWallet();
            const connectedContract = new ethers.Contract(contractAddress, contractABI, signer);

            // Call viewOwnMedicalRecords function
            const fetchedRecords = await connectedContract.viewOwnMedicalRecords();

            // Update state with fetched medical records
            setMedicalRecords(Array.isArray(fetchedRecords) ? fetchedRecords : []);
            console.log(fetchedRecords);
        } catch (error) {
            console.error("Error fetching medical records:", error);
            setMedicalRecords([]);
            toast.error("Failed to load medical records. Please try again.");
        } finally {
            setIsFetchingRecords(false);
        }
    }
    const fetchAccessRequests = async () => {
        setIsFetchingRequests(true);
        try {
            const patientEmail = localStorage.getItem("patientEmail");
            const response = await axios.post("/api/auth/getRequestedViewAccess", {
                email: patientEmail,
            });
            console.log("Access requests response:", response)
            const data = response.data;
            if (response.status === 200) {
                console.log("Access requests data:", data);
                // Ensure each request has a doctorName, use fallback if missing
                const requests = Array.isArray(data.requests) ? data.requests.map(req => ({
                    doctorName: req.doctorName || 'Unknown Doctor',
                    doctorBlockchainAddress: req.doctorBlockchainAddress || '',
                    hospitalAddress: req.hospitalAddress || '',
                    requestedAt: req.requestedAt || new Date().toISOString()
                })) : [];
                setAccessRequests(requests);

                // Dedbugging: Log the processed requests to verify doctorName is set
                console.log(JSON.stringify(data, null, 2));

            } else {
                throw new Error(data.message || "Failed to fetch access requests");
            }
        } catch (error) {
            console.error("Error fetching access requests:", error);
            setAccessRequests([]);
            toast.error("Failed to load access requests. Please try again.");
        } finally {
            setIsFetchingRequests(false);
        }
    };

    const memoizedRecords = useMemo(() => medicalRecords || [], [medicalRecords]);
    const memoizedRequests = useMemo(() => accessRequests || [], [accessRequests]);
    async function grantDoctorAccess(doctorAddress, doctorName) {
        if (!window.confirm(`Are you sure you want to grant access to ${doctorName}?`)) {
            return;
        }

        setLoadingRequests(prev => ({ ...prev, [doctorAddress]: true }));
        setMessage("");

        try {
                // Use centralized wallet util to ensure correct signer/provider
                const { provider, signer, address: signerAddress } = await getWallet();

                // Verify network matches expected chain from config
                try {
                    const net = await provider.getNetwork();
                    if (config.chainId && net.chainId !== config.chainId) {
                        const msg = `Wallet connected to chainId ${net.chainId} but expected ${config.chainId}.`;
                        console.error(msg);
                        // Show actionable prompt to switch network
                        setNetworkPrompt({ show: true, expectedChainId: config.chainId, pendingDoctorAddress: doctorAddress, pendingDoctorName: doctorName });
                        toast.error(`Failed to grant access to ${doctorName}. ${msg} Click 'Switch Network' to fix.`);
                        return;
                    }
                } catch (netErr) {
                    console.warn('Could not read provider network:', netErr?.message || netErr);
                }

                // Verify contract exists at configured address
                const code = await provider.getCode(contractAddress);
                if (!code || code === '0x') {
                    const msg = `Smart contract not found at ${contractAddress}. Please ensure you're on the correct network.`;
                    console.error(msg);
                    toast.error(`Failed to grant access to ${doctorName}. ${msg}`);
                    return;
                }

                if (!ethers.utils.isAddress(doctorAddress)) {
                    toast.error("Invalid doctor blockchain address.");
                    return;
                }

                // Load contract connected with signer
                const connectedContract = new ethers.Contract(contractAddress, contractABI, signer);

                console.log('Granting access to:', doctorAddress, 'from', signerAddress, 'via contract', contractAddress);

                // Estimate gas to catch upfront RPC failures
                try {
                    await connectedContract.estimateGas.grantDoctorAccess(doctorAddress);
                } catch (gasErr) {
                    console.error('estimateGas failed:', gasErr);
                    const short = gasErr?.reason || gasErr?.message || 'Unable to estimate gas for this transaction.';
                    toast.error(`Failed to grant access to ${doctorName}. ${short}`);
                    return;
                }

                const tx = await connectedContract.grantDoctorAccess(doctorAddress, { gasLimit: 300000 });
                console.log('Transaction:', tx);

                // Wait for transaction confirmation
                await tx.wait();

            // Remove the request from backend
            const patientEmail = localStorage.getItem("patientEmail");
            await axios.post("/api/auth/handleAccessRequest", {
                email: patientEmail,
                doctorBlockchainAddress: doctorAddress,
                action: "grant"
            });

            // Remove from local state
                setAccessRequests(prev => prev.filter(req => req.doctorBlockchainAddress?.toLowerCase()  !== doctorAddress?.toLowerCase()));
                toast.success(`Access granted to ${doctorName} successfully!`);
                // clear any pending network prompt state
                setNetworkPrompt({ show: false, expectedChainId: null, pendingDoctorAddress: null, pendingDoctorName: null });
        } catch (error) {
            console.error("Error granting access:", error);
            // extract useful message from different error shapes
            const errMsg = error?.reason || error?.error?.message || error?.message || error?.data || (error?.response && (error.response.data && (error.response.data.error || error.response.data.message))) || JSON.stringify(error);
            toast.error(`Failed to grant access to ${doctorName}. ${errMsg}`);
        } finally {
            setLoadingRequests(prev => ({ ...prev, [doctorAddress]: false }));
        }
    }

    async function handleSwitchNetwork() {
        const expected = networkPrompt.expectedChainId || config.chainId;
        if (!expected) {
            toast.error('No target chain configured.');
            return;
        }

        toast.info('Requesting wallet to switch network...');
        const ok = await switchToNetwork(expected);
        if (ok) {
            toast.info('Network switched. Re-attempting action...');
            // retry the pending grant if present
            const addr = networkPrompt.pendingDoctorAddress;
            const name = networkPrompt.pendingDoctorName;
            setNetworkPrompt({ show: false, expectedChainId: null, pendingDoctorAddress: null, pendingDoctorName: null });
            if (addr) await grantDoctorAccess(addr, name);
        } else {
            toast.error('Could not switch network. Please switch manually in MetaMask.');
        }
    }

    async function denyAccess(doctorAddress, doctorName) {
        if (!window.confirm(`Are you sure you want to deny access to ${doctorName}?`)) {
            return;
        }

        setLoadingRequests(prev => ({ ...prev, [doctorAddress]: true }));
        setMessage("");

        try {
            // Remove the request from backend
            const patientEmail = localStorage.getItem("patientEmail");
            await axios.post("/api/auth/handleAccessRequest", {
                email: patientEmail,
                doctorBlockchainAddress: doctorAddress,
                action: "deny"
            });

            // Remove from local state
            setAccessRequests(prev => prev.filter(req => req.doctorBlockchainAddress?.toLowerCase() !== doctorAddress?.toLowerCase()));
            setMessage(`Access request from ${doctorName} denied.`);
        } catch (error) {
            console.error("Error denying access:", error);
            setMessage(`Failed to deny access request from ${doctorName}. Please try again.`);
        } finally {
            setLoadingRequests(prev => ({ ...prev, [doctorAddress]: false }));
        }
    }

    return (
        <div className="dashboard-container">
            {/* Navigation */}
            <nav className="dashboard-nav">
                <div className="nav-container">
                    <div className="nav-brand">
                        <i className="fas fa-heartbeat"></i>
                        MedyEth
                    </div>
                    <div className="nav-actions">
                        <button onClick={logout} className="btn btn-outline">
                            <i className="fas fa-sign-out-alt"></i>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="dashboard-main">
                {/* Welcome Section */}
                <section className="welcome-section">
                    <h1>Welcome to Your Health Portal</h1>
                    <p>Manage your medical records and access requests securely with blockchain technology</p>
                </section>

                {/* Tab Navigation */}
                <div className="tab-navigation">
                    <button
                        className={`tab-button ${activeTab === 'records' ? 'active' : ''}`}
                        onClick={() => setActiveTab('records')}
                    >
                        <i className="fas fa-file-medical"></i>
                        Medical Records
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
                        onClick={() => setActiveTab('requests')}
                    >
                        <i className="fas fa-user-md"></i>
                        Access Requests
                        {accessRequests.length > 0 && (
                            <span className="notification-badge">{accessRequests.length}</span>
                        )}
                    </button>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {activeTab === 'records' && (
                        <>
                            <div className="section-header">
                                <h2>Your Medical Records</h2>
                                <p>View all your medical records stored securely on the blockchain</p>
                            </div>

                            {isFetchingRecords ? (
                                <div className="loading">Loading medical records...</div>
                            ) : memoizedRecords.length > 0 ? (
                                <div className="records-grid">
                                    {memoizedRecords.map((record, index) => (
                                        <div key={index} className="record-card">
                                            <div className="record-header">
                                                <div className="record-icon">
                                                    <i className="fas fa-notes-medical"></i>
                                                </div>
                                                <div className="record-meta">
                                                    <div className="record-date">
                                                        {new Date(Number(record.createdAt) * 1000).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="record-content">
                                                <h4>Medical Record #{index + 1}</h4>
                                                <div className="record-data">
                                                    {record.data}
                                                </div>
                                                <div className="record-doctor">
                                                    <i className="fas fa-user-md"></i>
                                                    {record.doctorName}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <i className="fas fa-file-medical-alt"></i>
                                    <h3>No Medical Records Found</h3>
                                    <p>Your medical records will appear here once they are added by your healthcare providers.</p>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'requests' && (
                        <>
                            <div className="section-header">
                                <h2>Access Requests</h2>
                                <p>Review and manage requests from healthcare providers to access your medical records</p>
                            </div>

                            {message && (
                                <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
                                    {message}
                                </div>
                            )}

                            {isFetchingRequests ? (
                                <div className="loading">Loading access requests...</div>
                            ) : memoizedRequests.length > 0 ? (
                                <div className="requests-container">
                                    {memoizedRequests.map((request, index) => (
                                        <div key={index} className="request-card">
                                            <div className="request-header">
                                                <div className="doctor-info">
                                                    <div className="doctor-avatar">
                                                        <i className="fas fa-user-md"></i>
                                                    </div>
                                                    <div>
                                                        <h4>{request.doctorName || 'Unknown Doctor'}</h4>
                                                        <div className="doctor-address">
                                                            {request.doctorBlockchainAddress}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="request-time">
                                                    <i className="fas fa-clock"></i>
                                                    {new Date(request.requestedAt).toLocaleDateString()}
                                                </div>
                                            </div>

                                            <div className="request-details">
                                                <div className="detail-item">
                                                    <i className="fas fa-hospital"></i>
                                                    {request.hospitalAddress}
                                                </div>
                                            </div>

                                            <div className="request-actions">
                                                <button
                                                    onClick={() => grantDoctorAccess(request.doctorBlockchainAddress, request.doctorName || 'Unknown Doctor')}
                                                    disabled={loadingRequests[request.doctorBlockchainAddress]}
                                                    className="btn btn-success"
                                                >
                                                    {loadingRequests[request.doctorBlockchainAddress] ? (
                                                        <>
                                                            <i className="fas fa-spinner fa-spin"></i>
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fas fa-check"></i>
                                                            Grant Access
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => denyAccess(request.doctorBlockchainAddress, request.doctorName || 'Unknown Doctor')}
                                                    disabled={loadingRequests[request.doctorBlockchainAddress]}
                                                    className="btn btn-danger"
                                                >
                                                    {loadingRequests[request.doctorBlockchainAddress] ? (
                                                        <>
                                                            <i className="fas fa-spinner fa-spin"></i>
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fas fa-times"></i>
                                                            Deny Access
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <i className="fas fa-inbox"></i>
                                    <h3>No Pending Requests</h3>
                                    <p>You don't have any pending access requests at the moment.</p>
                                </div>
                            )}

                            {/* Network switch prompt card */}
                            {networkPrompt.show && (
                                <div className="request-card" style={{ marginTop: 12 }}>
                                    <div style={{ marginBottom: 8 }}>Detected network mismatch. Expected chainId: {networkPrompt.expectedChainId}.</div>
                                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                        <button className="btn btn-outline" onClick={() => setNetworkPrompt({ show: false, expectedChainId: null })}>Dismiss</button>
                                        <button className="btn btn-success" onClick={handleSwitchNetwork}>Switch Network</button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
    
}

export default PatientDashboard;
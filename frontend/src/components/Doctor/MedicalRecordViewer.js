import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import config from "../../utils/smartContract";
import { getWallet } from '../../utils/wallet';
import "./css/MedicalRecordViewer.css"

const contractABI = config.contractABI;
const contractAddress = config.contractAddress;
const jsonRpcProviderUrl = config.jsonRpcProviderUrl;

function MedicalRecordViewer() {
  const { patientAddress } = useParams();
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchMedicalRecords() {
      setIsLoading(true);
      setMessage("");
      try {
            // Use wallet util for signer
            const { signer } = await getWallet();
            const connectedContract = new ethers.Contract(contractAddress, contractABI, signer);

            // Call viewPatientMedicalRecords function
            const fetchedRecords = await connectedContract.viewPatientMedicalRecords(patientAddress);

        // Update state with fetched medical records
        setMedicalRecords(fetchedRecords || []);
        if (!fetchedRecords || fetchedRecords.length === 0) setMessage('No medical records found for this patient.');
      } catch (error) {
        console.error("Error fetching medical records:", error);
        setMessage('Failed to load medical records.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMedicalRecords();
  }, [patientAddress]);

  return (
    <div className="medical-record-viewer-container">
      <h2 className="medical-record-viewer-title">Medical Records for Patient: {patientAddress}</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div />
        <button className="btn-success" onClick={async () => { setIsLoading(true); setMessage('Refreshing...'); try { const { signer } = await getWallet(); const connectedContract = new ethers.Contract(contractAddress, contractABI, signer); const fetchedRecords = await connectedContract.viewPatientMedicalRecords(patientAddress); setMedicalRecords(fetchedRecords || []); setMessage((fetchedRecords && fetchedRecords.length) ? '' : 'No medical records found for this patient.'); } catch (err) { console.error(err); setMessage('Failed to refresh records.'); } finally { setIsLoading(false); } }} disabled={isLoading}>
          {isLoading && <span className="btn-spinner" aria-hidden></span>}
          <span style={{ marginLeft: isLoading ? 8 : 0 }}>{isLoading ? 'Loading...' : 'Refresh'}</span>
        </button>
      </div>

      {isLoading ? (
        <div className="request-card">Loading medical records...</div>
      ) : (
        <>
          {message && <div className="request-card" style={{ marginBottom: 12 }}>{message}</div>}
          {medicalRecords.length > 0 ? (
            <ul className="medical-record-list">
              {medicalRecords.map((record, index) => (
                <li key={index} className="medical-record-item">
                  <p><strong>Data:</strong> {record.data}</p>
                  <p><strong>Doctor:</strong> {record.doctorName}</p>
                  <p><strong>Created At:</strong> {new Date(record.createdAt * 1000).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      )}
    </div>
  );
}

export default MedicalRecordViewer;

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

  useEffect(() => {
    async function fetchMedicalRecords() {
      try {
            // Use wallet util for signer
            const { signer } = await getWallet();
            const connectedContract = new ethers.Contract(contractAddress, contractABI, signer);

            // Call viewPatientMedicalRecords function
            const fetchedRecords = await connectedContract.viewPatientMedicalRecords(patientAddress);

        // Update state with fetched medical records
        setMedicalRecords(fetchedRecords);
      } catch (error) {
        console.error("Error fetching medical records:", error);
      }
    }

    fetchMedicalRecords();
  }, [patientAddress]);

  return (
    <div className="medical-record-viewer-container">
      <h2 className="medical-record-viewer-title">Medical Records for Patient: {patientAddress}</h2>
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
      ) : (
        <p className="no-medical-records-message">No medical records found for this patient.</p>
      )}
    </div>
  );
}

export default MedicalRecordViewer;

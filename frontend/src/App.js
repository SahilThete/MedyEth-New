import React from "react";
import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

/* ---------- Shared Pages ---------- */
import Home from "./components/Shared/Home";
import Logout from "./components/Shared/Logout";

/* ---------- Patient Pages ---------- */
import PatientRegistration from "./components/Patient/PatientRegistration";
import PatientLogin from "./components/Patient/PatientLogin";
import PatientDashboard from "./components/Patient/PatientDashboard";

/* ---------- Doctor Pages ---------- */
import DoctorRegistration from "./components/Doctor/DoctorRegistration";
import DoctorLogin from "./components/Doctor/DoctorLogin";
import DoctorDashboard from "./components/Doctor/DoctorDashboard";

/* ---------- Medical Records ---------- */
import MedicalRecordViewer from "./components/MedicalRecord/MedicalRecordViewer";
import AddMedicalRecord from "./components/MedicalRecord/AddMedicalRecord";

/* ---------- Future AI Module ---------- */
import AIChatbot from "./components/AIChatBot/AIChatbot";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* ---------- Default ---------- */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* ---------- Shared ---------- */}
          <Route path="/home" element={<Home />} />
          <Route path="/logout" element={<Logout />} />

          {/* ---------- Patient ---------- */}
          <Route path="/patient-registration" element={<PatientRegistration />} />
          <Route path="/patient-login" element={<PatientLogin />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />

          {/* ---------- Doctor ---------- */}
          <Route path="/doctor-registration" element={<DoctorRegistration />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />

          {/* ---------- Medical Records ---------- */}
          <Route path="/medical-records/:patientAddress" element={<MedicalRecordViewer />} />
          <Route path="/add-medical-record/:patientAddress" element={<AddMedicalRecord />} />
           
          {/* ---------- Catch All ---------- */}
          <Route path="*" element={<Navigate to="/home" replace />} />

        </Routes>

      </AuthProvider>
      <AIChatbot />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#0f172a",
            color: "#fff",
            borderRadius: "12px",
            padding: "14px 16px",
            fontSize: "14px",
          },
          success: {
            style: {
              background: "#16a34a",
            },
          },
          error: {
            style: {
              background: "#dc2626",
            },
          },
        }}
      />
      
    </Router>
  );
}

export default App;

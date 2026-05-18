import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";

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
// import AIChatbot from "./components/AIChatBot/AIChatbot";

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
           

          {/* ---------- Future AI Module ---------- */}
          {/* <Route path="/ai-chatbot" element={<AIChatbot />} /> */}

          {/* ---------- Catch All ---------- */}
          <Route path="*" element={<Navigate to="/home" replace />} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

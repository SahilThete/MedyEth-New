import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Registration from "./components/Registration";
import Dashboard from "./components/Dashboard";
import PatientRegistration from "./components/Patient/PatientRegistration"
import PatientLogin from "./components/Patient/PatientLogin"
import PatientDashboard from "./components/Patient/PatientDashboard"
import DoctorRegistration from "./components/Doctor/DoctorRegistration";
import DoctorLogin from "./components/Doctor/DoctorLogin";
import Home from "./components/Home";
import MedicalRecordViewer from "./components/Doctor/MedicalRecordViewer";
import DoctorDashboard from "./components/Doctor/DoctorDashboard";
import AddMedicalRecord from "./components/Doctor/AddMedicalRecord";
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patient-registration" element={<PatientRegistration />} />
          <Route path="/patient-login" element={<PatientLogin />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/doctor-registration" element={<DoctorRegistration />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/medical-records/:patientAddress" element={<MedicalRecordViewer />} />
          <Route path="/add-medical-record/:patientAddress" element={<AddMedicalRecord />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

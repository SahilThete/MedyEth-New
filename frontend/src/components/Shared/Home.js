import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Home.css";

const Home = () => {
  const navigate = useNavigate();

  const goToPatientLogin = () => {
    navigate("/patient-login");
  };

  const goToDoctorLogin = () => {
    navigate("/doctor-login");
  };

  const goToPatientRegistration = () => {
    navigate("/patient-registration");
  };

  const goToDoctorRegistration = () => {
    navigate("/doctor-registration");
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="container navbar-container">
          <a href="/" className="navbar-brand">
            <i className="fas fa-heartbeat"></i>
            MedyEth
          </a>
          <ul className="navbar-nav">
            <li><a href="/" className="navbar-link">Home</a></li>
            <li><a href="#about" className="navbar-link">About</a></li>
            <li><a href="#contact" className="navbar-link">Contact</a></li>
          </ul>
        </div>
      </nav>

      <main className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Secure Healthcare Management
                <span className="hero-subtitle">Powered by Blockchain</span>
              </h1>
              <p className="hero-description">
                Experience the future of healthcare with our decentralized medical records system.
                Secure, transparent, and patient-controlled access to your health data.
              </p>
              <div className="hero-features">
                <div className="feature-item">
                  <i className="fas fa-shield-alt"></i>
                  <span>Blockchain Security</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-user-md"></i>
                  <span>Doctor Verification</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-lock"></i>
                  <span>Patient Privacy</span>
                </div>
              </div>
            </div>
            <div className="hero-actions">
              <div className="action-card">
                <h3>For Patients</h3>
                <p>Access your medical records securely and grant permissions to healthcare providers.</p>
                <div className="button-group">
                  <button className="btn btn-primary" onClick={goToPatientLogin}>
                    <i className="fas fa-sign-in-alt"></i>
                    Patient Login
                  </button>
                  <button className="btn btn-secondary" onClick={goToPatientRegistration}>
                    <i className="fas fa-user-plus"></i>
                    Register
                  </button>
                </div>
              </div>
              <div className="action-card">
                <h3>For Healthcare Providers</h3>
                <p>Request access to patient records and manage medical data with full transparency.</p>
                <div className="button-group">
                  <button className="btn btn-primary" onClick={goToDoctorLogin}>
                    <i className="fas fa-stethoscope"></i>
                    Doctor Login
                  </button>
                  <button className="btn btn-secondary" onClick={goToDoctorRegistration}>
                    <i className="fas fa-user-plus"></i>
                    Register
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="about-section" id="about">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose MedyEth?</h2>
            <p>Revolutionizing healthcare with cutting-edge blockchain technology</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-link"></i>
              </div>
              <h4>Decentralized Security</h4>
              <p>Your medical data is stored securely on the blockchain, ensuring immutability and protection against unauthorized access.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <h4>Patient Control</h4>
              <p>You have complete control over who can access your medical records. Grant and revoke permissions instantly.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-clock"></i>
              </div>
              <h4>Real-time Access</h4>
              <p>Healthcare providers can access your records instantly with your permission, enabling faster and better care.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-file-medical"></i>
              </div>
              <h4>Comprehensive Records</h4>
              <p>Store all your medical history, test results, and treatment records in one secure, accessible location.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer" id="contact">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>MedyEth</h3>
              <p>Secure Healthcare Management Platform</p>
            </div>
            <div className="footer-links">
              <div className="footer-section">
                <h4>Quick Links</h4>
                <ul>
                  <li><a href="/">Home</a></li>
                  <li><a href="#about">About</a></li>
                  <li><a href="#contact">Contact</a></li>
                </ul>
              </div>
              <div className="footer-section">
                <h4>Support</h4>
                <ul>
                  <li><a href="#">Help Center</a></li>
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Terms of Service</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 MedyEth. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

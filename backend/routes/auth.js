require('dotenv').config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Patient = require("../models/patient");
const crypto = require("crypto");
const Doctor = require('../models/doctor');
const router = express.Router();

// Fetch secret key and IV from environment variables
const secretKey = Buffer.from(JSON.parse(process.env.SECRET_KEY));
const iv = Buffer.from(JSON.parse(process.env.IV));

// AES Encryption
function encryptData(data) {
    const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

// AES Decryption
function decryptData(encryptedData) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}


// Patient login
router.post("/patientlogin", async (req, res) => {
    const { email, password } = req.body;
    const patient = await Patient.findOne({ email: email });
    if (!patient) return res.status(400).send("Invalid username or password.");

    if (decryptData(patient.password) !== password) {
        return res.status(400).send("Invalid username or password.");
    }

    const token = jwt.sign({ userId: patient.id }, "THISISJWTTOKEN");
    const decryptedAddress = decryptData(patient.blockchainAddress);
    res.send({ token, decryptedAddress });
});
// Patient registration
router.post("/patientRegistration", async (req, res) => {
    try {
        const { email, password, FirstName, LastName, Gender, Age, Weight, blockchainAddress } = req.body;
        const encryptedAddress = encryptData(blockchainAddress);
        const encryptedPassword = encryptData(password);

        const existingPatient = await Patient.findOne({ email: email });
        if (existingPatient) {
            return res.status(400).json({ error: "Username already exists." });
        }

        const patient = new Patient({
            FirstName,
            LastName,
            email,
            password: encryptedPassword,
            Gender,
            Age,
            Weight,
            blockchainAddress: encryptedAddress
        });

        const savedPatient = await patient.save();
        res.json({
            message: "User registered successfully",
            userId: savedPatient._id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Doctor registration
router.post("/doctorRegistration", async (req, res) => {
    try {
        const { email, password, FirstName, LastName, Gender, DateOfBirth, address, Specility, blockchainAddress } = req.body;
        const encryptedAddress = encryptData(blockchainAddress);
        const encryptedPassword = encryptData(password);

        const existingPatient = await Doctor.findOne({ email: email });
        if (existingPatient) {
            return res.status(400).json({ error: "Username already exists." });
        }

        const doc = new Doctor({
            FirstName,
            LastName,
            email,
            password: encryptedPassword,
            Gender,
            DateOfBirth,
            address,
            Specialization :Specility,
            blockchainAddress: encryptedAddress
        });

        const savedDoctor = await doc.save();
        res.json({
            message: "User registered successfully",
            userId: savedDoctor._id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Doctor login
router.post("/doctorlogin", async (req, res) => {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email: email });
    if (!doctor) return res.status(400).send("Invalid username or password.");

    if (decryptData(doctor.password) !== password) {
        return res.status(400).send("Invalid username or password.");
    }

    const token = jwt.sign({ userId: doctor.id }, "THISISJWTTOKEN");
    const decryptedAddress = decryptData(doctor.blockchainAddress);
    res.send({ 
        token, 
        decryptedAddress,
        name: `${doctor.FirstName} ${doctor.LastName}`
    });
});

// Doctor requesting patient for access
// the data will be added to array of DoctorRequests inside the Patient model
router.post("/RequestPatientViewAccess", async (req, res) => {
    const { patientEmail, doctorName, doctorBlockchainAddress, hospitalAddress } = req.body;
    
    // Basic input validation
    if (!patientEmail || typeof patientEmail !== 'string') {
        return res.status(400).json({ error: "Valid patientEmail is required." });
    }
    if (!doctorBlockchainAddress || typeof doctorBlockchainAddress !== 'string') {
        return res.status(400).json({ error: "Valid doctorBlockchainAddress is required." });
    }
    const cleanDoctorName = (doctorName && doctorName !== 'undefined') ? String(doctorName) : 'Unknown Doctor';
    
    try {
        const patient = await Patient.findOne({ email: patientEmail });
        if (!patient) {
            return res.status(404).json({ error: "Patient not found." });
        }

        // Check if request already exists (compare case-insensitive)
        const existingRequest = patient.DoctorRequests.find(r => (r.doctorBlockchainAddress || '').toLowerCase() === doctorBlockchainAddress.toLowerCase());
        if (existingRequest) {
            return res.status(400).json({ error: "Access request already sent." });
        }

        // Push normalized entry
        patient.DoctorRequests.push({
            doctorName: cleanDoctorName,
            doctorBlockchainAddress: doctorBlockchainAddress,
            hospitalAddress: hospitalAddress ? String(hospitalAddress) : '',
            requestedAt: new Date()
        });

        await patient.save();
        res.json({ message: "Access request sent successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Used by patient to get the array of doctors who requested access
router.post("/getRequestedViewAccess", async (req, res) => {
    const { email } = req.body;
    try {
        const patient = await Patient.findOne({ email: email });
        if (!patient) {
            return res.status(404).json({ error: "Patient not found." });
        }

        // Normalize and sanitize response entries
        const requests = (patient.DoctorRequests || []).map(r => ({
            doctorName: (r.doctorName && r.doctorName !== 'undefined') ? String(r.doctorName) : 'Unknown Doctor',
            doctorBlockchainAddress: r.doctorBlockchainAddress ? String(r.doctorBlockchainAddress) : '',
            hospitalAddress: r.hospitalAddress ? String(r.hospitalAddress) : '',
            requestedAt: r.requestedAt ? new Date(r.requestedAt).toISOString() : new Date().toISOString()
        }))
        // sort newest first
        .sort((a,b) => new Date(b.requestedAt) - new Date(a.requestedAt));

        res.json({ requests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Used by patient to remove access request after granting or denying
router.post("/handleAccessRequest", async (req, res) => {
    const { email, doctorBlockchainAddress, action } = req.body; // action: 'grant' or 'deny'
    try {
        if (!email || !doctorBlockchainAddress || !action) {
            return res.status(400).json({ error: 'email, doctorBlockchainAddress and action are required.' });
        }

        const patient = await Patient.findOne({ email: email });
        if (!patient) {
            return res.status(404).json({ error: "Patient not found." });
        }

        // Find and remove the request (case-insensitive match)
        const idx = patient.DoctorRequests.findIndex(r => (r.doctorBlockchainAddress || '').toLowerCase() === String(doctorBlockchainAddress).toLowerCase());
        if (idx === -1) {
            return res.status(404).json({ error: "Access request not found." });
        }

        const removed = patient.DoctorRequests.splice(idx, 1)[0];

        // If action is 'grant' you might want to persist granted access elsewhere (not implemented here)
        await patient.save();

        res.json({ message: `Access request ${action}ed successfully.`, removed });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});



module.exports = router;

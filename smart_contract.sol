// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EHRSystem {
    // Structure to hold medical record information
    struct MedicalRecord {
        string data;
        string doctorName;
        uint256 createdAt;
    }
    
    // Structure to hold patient information
    struct Patient {
        string name;
        address patientAddress;
        MedicalRecord[] medicalRecords;
       address[] authorizedDoctorAddresses;
    }
    
    // Structure to hold doctor information
    struct Doctor {
        string name;
        address doctorAddress;
        address[] authorizedPatients;
    }

    // Mapping to store patient records
    mapping(address => Patient) public patients;
    
    // Mapping to store doctor records
    mapping(address => Doctor) public doctors;

    // Events to track actions
    event PatientRegistered(address indexed patientAddress, string name);
    event DoctorRegistered(address indexed doctorAddress, string name);
    event MedicalRecordUpdated(address indexed patientAddress, string data, string doctorName, uint256 createdAt);
    event DoctorAccessGranted(address indexed patientAddress, address indexed doctorAddress);
    event DoctorAccessRevoked(address indexed patientAddress, address indexed doctorAddress);
    
    // Function for patient registration
    function registerPatient(string memory _name) public {
        require(patients[msg.sender].patientAddress == address(0), "Patient is already registered");
        patients[msg.sender].name = _name;
        patients[msg.sender].patientAddress = msg.sender;
        emit PatientRegistered(msg.sender, _name);
    }

    // Function for doctor registration
    function registerDoctor(string memory _name) public {
        require(doctors[msg.sender].doctorAddress == address(0), "Doctor is already registered");
        doctors[msg.sender].name = _name;
        doctors[msg.sender].doctorAddress = msg.sender;
        emit DoctorRegistered(msg.sender, _name);
    }

    // Function for patient to view their own medical records
    function viewOwnMedicalRecords() public view returns (MedicalRecord[] memory) {
        return patients[msg.sender].medicalRecords;
    }

  // Function for patient to grant access to doctor to view and update medical records
function grantDoctorAccess(address _doctorAddress) public {
    patients[msg.sender].authorizedDoctorAddresses.push(_doctorAddress);
    doctors[_doctorAddress].authorizedPatients.push(msg.sender); // Update authorizedPatients array in Doctor struct
    emit DoctorAccessGranted(msg.sender, _doctorAddress);
}


// Function for patient to revoke access to doctor to view and update medical records
function revokeDoctorAccess(address _doctorAddress) public {
    address[] storage authorizedDoctorAddresses = patients[msg.sender].authorizedDoctorAddresses;

    // Remove doctor's address from patient's authorizedDoctorAddresses array
    for (uint256 i = 0; i < authorizedDoctorAddresses.length; i++) {
        if (authorizedDoctorAddresses[i] == _doctorAddress) {
            authorizedDoctorAddresses[i] = authorizedDoctorAddresses[authorizedDoctorAddresses.length - 1];
            authorizedDoctorAddresses.pop();
            break;
        }
    }

    // Remove patient's address from doctor's authorizedPatients array
    address[] storage authorizedPatients = doctors[_doctorAddress].authorizedPatients;
    for (uint256 i = 0; i < authorizedPatients.length; i++) {
        if (authorizedPatients[i] == msg.sender) {
            authorizedPatients[i] = authorizedPatients[authorizedPatients.length - 1];
            authorizedPatients.pop();
            break;
        }
    }
    
    emit DoctorAccessRevoked(msg.sender, _doctorAddress);
}

    // Function for doctor to view patient's medical records (only if access is granted by patient)
    function viewPatientMedicalRecords(address _patientAddress) public view returns (MedicalRecord[] memory) {
    bool accessGranted = false;
    address[] memory authorizedDoctorAddresses = patients[_patientAddress].authorizedDoctorAddresses;
    
    // Check if the calling doctor's address is in the authorizedDoctorAddresses array
    for (uint256 i = 0; i < authorizedDoctorAddresses.length; i++) {
        if (authorizedDoctorAddresses[i] == msg.sender) {
            accessGranted = true;
            break;
        }
    }
    
    // Ensure access is granted before returning medical records
    require(accessGranted, "Doctor does not have access to view medical records");
    return patients[_patientAddress].medicalRecords;
}

// Function for doctor to update patient's medical records (only if access is granted by patient)
function updatePatientMedicalRecord(address _patientAddress, string memory _data, string memory _doctorName) public {
    bool accessGranted = false;
    address[] memory authorizedDoctorAddresses = patients[_patientAddress].authorizedDoctorAddresses;
    
    // Check if the calling doctor's address is in the authorizedDoctorAddresses array
    for (uint256 i = 0; i < authorizedDoctorAddresses.length; i++) {
        if (authorizedDoctorAddresses[i] == msg.sender) {
            accessGranted = true;
            break;
        }
    }
    
    // Ensure access is granted before updating medical records
    require(accessGranted, "Doctor does not have access to update medical records");
    
    // Create a new medical record
    MedicalRecord memory newRecord = MedicalRecord(_data, _doctorName, block.timestamp);
    
    // Add the new record to the patient's medical records array
    patients[_patientAddress].medicalRecords.push(newRecord);
    
    // Emit an event to signify the update of medical records
    emit MedicalRecordUpdated(_patientAddress, _data, _doctorName, block.timestamp);
}

    // Function for doctor to view list of patients who have authorized them
    function viewAuthorizedPatients() public view returns (string[] memory, address[] memory) {
        address[] memory authorizedPatientsAddresses = doctors[msg.sender].authorizedPatients;
        string[] memory authorizedPatientsNames = new string[](authorizedPatientsAddresses.length);
        for (uint256 i = 0; i < authorizedPatientsAddresses.length; i++) {
            authorizedPatientsNames[i] = patients[authorizedPatientsAddresses[i]].name;
        }
        return (authorizedPatientsNames, authorizedPatientsAddresses);
    }

    // Function for patient to view list of doctors authorized to access their medical records
function viewAuthorisedDoctors() public view returns (string[] memory, address[] memory) {
    address[] memory authorizedDoctorsAddresses = patients[msg.sender].authorizedDoctorAddresses;
    string[] memory authorisedDoctorsNames = new string[](authorizedDoctorsAddresses.length);
    for (uint256 i = 0; i < authorizedDoctorsAddresses.length; i++) {
        authorisedDoctorsNames[i] = doctors[authorizedDoctorsAddresses[i]].name;
    }
    return (authorisedDoctorsNames, authorizedDoctorsAddresses);
}
}

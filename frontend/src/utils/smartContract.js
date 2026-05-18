const config = {
    
    contractAddress: "0xa278918c5afF633187212D9088B0ec29cA54b7b8",
    jsonRpcProviderUrl: "https://sepolia.infura.io/v3/66912b8fd749492f9c844e6186b5d3d3",
    
    // contractAddress: "0x905CFCbb92f67EbE1eB987c3Bf3fAC94E5978Fe8",
    // jsonRpcProviderUrl: "https://sepolia.infura.io/v3/06d25618a0da4200983bb08856d5a352",

    // Expected network chain id for the RPC above (Sepolia)
    chainId: 11155111,
    contractABI: [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "patientAddress",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "doctorAddress",
                    "type": "address"
                }
            ],
            "name": "DoctorAccessGranted",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "patientAddress",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "doctorAddress",
                    "type": "address"
                }
            ],
            "name": "DoctorAccessRevoked",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "doctorAddress",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                }
            ],
            "name": "DoctorRegistered",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "patientAddress",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "data",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "doctorName",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "createdAt",
                    "type": "uint256"
                }
            ],
            "name": "MedicalRecordUpdated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "patientAddress",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                }
            ],
            "name": "PatientRegistered",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "doctors",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "doctorAddress",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_doctorAddress",
                    "type": "address"
                }
            ],
            "name": "grantDoctorAccess",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "patients",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "patientAddress",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                }
            ],
            "name": "registerDoctor",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                }
            ],
            "name": "registerPatient",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_doctorAddress",
                    "type": "address"
                }
            ],
            "name": "revokeDoctorAccess",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_patientAddress",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "_data",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_doctorName",
                    "type": "string"
                }
            ],
            "name": "updatePatientMedicalRecord",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "viewAuthorisedDoctors",
            "outputs": [
                {
                    "internalType": "string[]",
                    "name": "",
                    "type": "string[]"
                },
                {
                    "internalType": "address[]",
                    "name": "",
                    "type": "address[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "viewAuthorizedPatients",
            "outputs": [
                {
                    "internalType": "string[]",
                    "name": "",
                    "type": "string[]"
                },
                {
                    "internalType": "address[]",
                    "name": "",
                    "type": "address[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "viewOwnMedicalRecords",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "string",
                            "name": "data",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "doctorName",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "createdAt",
                            "type": "uint256"
                        }
                    ],
                    "internalType": "struct EHRSystem.MedicalRecord[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_patientAddress",
                    "type": "address"
                }
            ],
            "name": "viewPatientMedicalRecords",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "string",
                            "name": "data",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "doctorName",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "createdAt",
                            "type": "uint256"
                        }
                    ],
                    "internalType": "struct EHRSystem.MedicalRecord[]",
                    "name": "",
                    "type": "tuple[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
};

export default config;
import contractABI from './contract_ABI.json';  // Path to your contract ABI
import { ethers } from "ethers";

const address = localStorage.getItem("blockchainAddress");

const contractAddress = address;  // Your smart contract address

// This function sets up a contract instance
export function useContract() {
    let provider, signer, contract;

    // Initialize a provider
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, contractABI, signer);
    } else {
        console.error("Ethereum object not found, install MetaMask.");
        // Or connect to a default provider
        provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/66912b8fd749492f9c844e6186b5d3d3');
        // provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/06d25618a0da4200983bb08856d5a352');
        contract = new ethers.Contract(contractAddress, contractABI, provider);
    }

    return contract;
}

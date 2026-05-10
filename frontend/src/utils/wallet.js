import { ethers } from 'ethers';

export async function getWallet() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('No Ethereum wallet detected. Please install MetaMask.');
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  // Request accounts if needed
  await provider.send('eth_requestAccounts', []);
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  return { provider, signer, address };
}

export function getReadOnlyProvider(rpcUrl) {
  return new ethers.providers.JsonRpcProvider(rpcUrl);
}

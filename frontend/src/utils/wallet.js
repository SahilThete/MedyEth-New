import { ethers } from 'ethers';
import config from './smartContract';

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

export async function switchToNetwork(targetChainId) {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('No Ethereum wallet detected. Please install MetaMask.');
  }

  const targetHex = (typeof targetChainId === 'number')
    ? '0x' + targetChainId.toString(16)
    : targetChainId; // assume already hex

  try {
    await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: targetHex }] });
    return true;
  } catch (switchError) {
    // 4902: chain not added to MetaMask
    if (switchError && switchError.code === 4902) {
      try {
        const rpc = config.jsonRpcProviderUrl ? [config.jsonRpcProviderUrl] : [];
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: targetHex,
            chainName: 'Custom',
            rpcUrls: rpc,
            nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
          }]
        });
        // try switching again
        await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: targetHex }] });
        return true;
      } catch (addErr) {
        console.error('Failed to add chain to wallet:', addErr);
        return false;
      }
    }
    console.error('Failed to switch network:', switchError);
    return false;
  }
}

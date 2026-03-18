import { BrowserProvider, Contract } from 'ethers'

// TODO: replace with your deployed contract address
export const HOSPITAL_VERIFICATION_CONTRACT_ADDRESS = import.meta.env.VITE_HOSPITAL_VERIFICATION_ADDRESS || ''

// Minimal ABI for the functions we use
const ABI = [
  'function isVerified(address _hospital) view returns (bool)',
  'function getHospitalDetails(address _hospital) view returns (string name,bool registered,bool verified,uint256 badgeId,uint256 registeredAt,uint256 verifiedAt)',
  'function registerHospital(address _hospital,string _name)',
  'function approveHospital(address _hospital)',
  'function revokeHospital(address _hospital)',
  'function admin() view returns (address)',
]

async function getSignerAndContract() {
  if (!window.ethereum) throw new Error('No wallet found (window.ethereum missing)')
  if (!HOSPITAL_VERIFICATION_CONTRACT_ADDRESS) throw new Error('Contract address not configured')

  const provider = new BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()
  const contract = new Contract(HOSPITAL_VERIFICATION_CONTRACT_ADDRESS, ABI, signer)
  return { signer, contract }
}

async function getReadOnlyContract() {
  if (!window.ethereum) return null
  if (!HOSPITAL_VERIFICATION_CONTRACT_ADDRESS) return null
  try {
    const provider = new BrowserProvider(window.ethereum)
    return new Contract(HOSPITAL_VERIFICATION_CONTRACT_ADDRESS, ABI, provider)
  } catch {
    return null
  }
}

export async function fetchHospitalVerification(address) {
  try {
    const contract = await getReadOnlyContract()
    if (!contract || !address) {
      return { verified: false, badgeId: null, name: null, registered: false }
    }

    const [name, registered, verified, badgeId] = await contract.getHospitalDetails(address)
    return {
      name,
      registered,
      verified,
      badgeId: Number(badgeId),
    }
  } catch {
    return { verified: false, badgeId: null, name: null, registered: false }
  }
}

export async function registerHospitalOnChain(hospitalAddress, name) {
  const { contract } = await getSignerAndContract()
  const tx = await contract.registerHospital(hospitalAddress, name)
  return tx.wait()
}

export async function approveHospitalOnChain(hospitalAddress) {
  const { contract } = await getSignerAndContract()
  const tx = await contract.approveHospital(hospitalAddress)
  return tx.wait()
}

export async function revokeHospitalOnChain(hospitalAddress) {
  const { contract } = await getSignerAndContract()
  const tx = await contract.revokeHospital(hospitalAddress)
  return tx.wait()
}


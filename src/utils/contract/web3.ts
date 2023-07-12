import { Contract, ethers } from "ethers";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import type { InterfaceAbi } from "ethers";
import { generatePrivateKey } from "nostr-tools";

type Instance = {
  provider: BrowserProvider;
  signer: JsonRpcSigner;
};

let signer: JsonRpcSigner;
let provider: BrowserProvider;
// 获取 provider 实例
export async function getProviderSignerInstance(): Promise<Instance> {
  if (!provider) {
    // @ts-ignore
    if (window.ethereum == null) {
      // If MetaMask is not installed, we use the default provider,
      // which is backed by a variety of third-party services (such
      // as INFURA). They do not have private keys installed so are
      // only have read-only access
      // @ts-ignore
      provider = ethers.getDefaultProvider();
      window.alert("MetaMask not installed; using read-only defaults");
    } else {
      // Connect to the MetaMask EIP-1193 object. This is a standard
      // protocol that allows Ethers access to make all read-only
      // requests through MetaMask.
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
    }
  }

  // console.log("provider", provider);
  // console.log("signer", signer);

  return { provider, signer };
}

export async function getWalletAddres() {
  const { signer } = await getProviderSignerInstance();

  return signer.getAddress();
}

export async function getReadonlyConractInstance(
  addr: string,
  abi: InterfaceAbi
) {
  const { provider } = await getProviderSignerInstance();
  const contract = new Contract(addr, abi, provider);

  return contract;
}

export async function getWritebleContractInstance(
  addr: string,
  abi: InterfaceAbi
) {
  const { signer } = await getProviderSignerInstance();
  const contract = new Contract(addr, abi, signer);

  return contract;
}

export function getRequestID(len = 0) {
  const id64 = generatePrivateKey();

  if (len) {
    return id64.substr(0, 32);
  }

  return "0x" + id64;
}

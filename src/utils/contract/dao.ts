import {
  getReadonlyConractInstance,
  getWritebleContractInstance
} from "./web3";

// @ts-ignore
import ABI from "./dao-abi.json?raw";
const ADDR = "0x6051273DB68F2af68617589f30F8a91f859e5b82";

let writeContract;
export async function getDaoContract() {
  if (!writeContract) {
    writeContract = await getWritebleContractInstance(ADDR, ABI);
  }

  return writeContract;
}

let readContract;
export async function getReadonlyDaoContract() {
  if (!readContract) {
    readContract = await getReadonlyConractInstance(ADDR, ABI);
  }

  return readContract;
}

export type DAO = {
  // daoId: string;
  image: string;
  name: string;
  description: string;
  jsoninfo: string;
};

export type UserNFT = {
  tokenId: number;
  daoId: number;
  user: string;
  metadata: string;
  image: string;
};

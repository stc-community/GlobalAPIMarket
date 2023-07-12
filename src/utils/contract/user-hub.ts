import { getWritebleContractInstance } from "./web3";

// @ts-ignore
import ABI from "./user-hub.json?raw";
const ADDR = "0x5D9D1DC34c46707ebCd4e4473c81Cc5BD69A4c98";

export async function getUserHubContract() {
  const contract = await getWritebleContractInstance(ADDR, ABI);

  return contract;
}

import { defineStore } from "pinia";
import { store } from "@/store";
import { accountType } from "./types";
import { getPublicKey } from "nostr-tools";
// import { storageLocal } from "@pureadmin/utils";
import { getUserHubContract } from "@/utils/contract/user-hub";
import { handleEtherError, decrypt } from "@/utils/shared";
import { getWalletAddres } from "@/utils/contract/web3";

export const useAccountStore = defineStore({
  id: "account-settings",
  state: (): accountType => ({
    name: "",
    publicKey: "",
    privateKey: "" //storageLocal().getItem("sk") || ""
  }),
  getters: {
    getPublicKey() {
      return this.publicKey;
    },
    getPrivateKey() {
      return this.privateKey;
    }
  },
  actions: {
    SET_NAME(name: string) {
      this.name = name;
    },
    SET_PUBLICKEY(key: string) {
      this.publicKey = key;
    },
    SET_PRIVATEKEY(key: string) {
      this.privateKey = key;
    },
    async init(): Promise<any> {
      try {
        const address = await getWalletAddres();
        const contract = await getUserHubContract();
        const data = await contract.getUserInfo(address);
        if (!data[0]) return;

        const { privateKey } = data[1];
        const truePrivateKey = decrypt(privateKey);
        this.savePrivateKey(truePrivateKey);
        console.log("2")
      } catch (e) {
        handleEtherError(e);
      }
    },
    savePrivateKey(sk: string): string {
      try {
        const pk = getPublicKey(sk);
        this.SET_PRIVATEKEY(sk);
        this.SET_PUBLICKEY(pk);
        this.SET_NAME(pk.substring(0, 2));
        // storageLocal().setItem("sk", sk);
        return "";
      } catch (e) {
        return e.message;
      }
    }
  }
});

export function useAccountStoreHook() {
  return useAccountStore(store);
}

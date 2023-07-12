<script setup lang="ts">
import { ref } from "vue";
import { useLang } from "@/hooks/useLang";
const { t } = useLang();
import { getNewNostrPrivateKey } from "@/utils/shared";
import { getPublicKey } from "nostr-tools";
import { getUserHubContract } from "@/utils/contract/user-hub";
import { handleEtherError, encrypt } from "@/utils/shared";

const privateKey = ref("");
const loading = ref(false);

const handleSubmit = async () => {
  privateKey.value = getNewNostrPrivateKey();
  const publicKey = getPublicKey(privateKey.value);

  const contract = await getUserHubContract();

  try {
    loading.value = true;
    console.log("contract.registerUser", publicKey, encrypt(privateKey.value));
    const transaction = await contract.registerUser(
      publicKey,
      encrypt(privateKey.value)
    );

    await transaction.wait();
    window.location.reload();
  } catch (e) {
    loading.value = false;
    handleEtherError(e);
  }
};
</script>
<template>
  <!-- Put this part before </body> tag -->
  <input type="checkbox" id="key-modal" class="modal-toggle" />
  <div class="modal backdrop-blur-sm">
    <div class="modal-box w-11/12 max-w-xl relative">
      <label
        for="key-modal"
        class="btn btn-sm btn-circle absolute right-2 top-2"
        >✕</label
      >

      <h3 class="font-bold text-lg">{{ t("user.modal title") }}</h3>
      <p class="py-4">{{ t("user.modal description") }}</p>
      <div class="modal-action">
        <label
          class="btn btn-primary"
          :class="{ 'btn-disabled': loading }"
          @click="handleSubmit"
        >
          <span v-if="loading" class="loading loading-spinner" />
          <span>{{ t("user.join now") }}!</span>
        </label>
      </div>
    </div>
  </div>
</template>

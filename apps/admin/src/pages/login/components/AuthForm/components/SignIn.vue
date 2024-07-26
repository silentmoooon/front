<script setup lang="ts">
import type { FormInst, FormRules } from "naive-ui";
import { useI18n } from "@celeris/locale";
import { getWallets, wallets } from "@depay/web3-wallets";
import { useUserStore } from "~/store/modules/user";

const emit = defineEmits<{
  (e: "forgot-password"): void;
}>();

const { t } = useI18n();

const message = useMessage();
const notification = useNotification();

const loginFormModel: SignInFromType = reactive<SignInFromType>({
  username: "kirklin",
  password: "123456",
});
const loginRules: FormRules = reactive({
  username: [{ required: true, message: t("page.login.form.username.error"), trigger: "blur" }],
  password: [{ required: true, message: t("page.login.form.password.error"), trigger: "blur" }],
});

const loading = ref<boolean>(false);
const loginFormRef = ref<HTMLElement & FormInst>();

/**
 * This function handles the login process
 */
async function signIn(e: Event) {
  e.preventDefault();
  try {
    const availableWallets = await getWallets();
    console.log("availableWallets", availableWallets.length);
    let wallet;
    if (availableWallets.length === 1) {
      wallet = availableWallets[0];
    } else if (availableWallets.length > 1) {
      wallet = availableWallets[Number.parseInt(prompt("Which wallet do you want to connect?"), 10)];
    } else {
      // Let the user choose:
      // you can still try to connect via wallets.WalletConnect.connect()
      // or wallets.WalletLink.connect()
      wallet = wallets.WalletLink;
    }

    const accounts = await wallet.connect();
    const loginText = "this is a login message with unuspay";
    const signature = await wallet.sign(loginText);

    loading.value = true;

    try {
      // Login the user
      const userInfo = await useUserStore().login({
        walletAddress: accounts,
        signature,
        plainText: loginText,
        walletName: wallet.name,
        walletType: wallet.name,

      });
      console.log("userInfo", userInfo);
      if (userInfo) {
        notification.success({
          title: t("page.login.notification.loginSuccessMessage"),
          content: t("page.login.notification.welcomeBackMessage", { username: userInfo.fullName }),
        });
      }
    } catch (error) {
      console.log("error", error);
      message.error(t("page.login.form.incorrectAccountOrPassword"));
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="w-full">
    <NButton type="primary" :loading="loading" class="w-full!" size="large" @click="signIn">
      {{ t('page.login.form.loginButton') }}
    </NButton>
  </div>
</template>

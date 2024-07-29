<script setup lang="ts">
import type { FormInst, FormRules } from "naive-ui";
import { useI18n } from "@celeris/locale";
import { getWallets, wallets } from "@depay/web3-wallets";
import DePayWidgets from "@celeris/widgets";
import { Web3 } from "web3";
import base58 from "bs58";
import { useUserStore } from "~/store/modules/user";

const emit = defineEmits<{
    (e: "forgot-password"): void;
}>();

const { t } = useI18n();

const message = useMessage();
const notification = useNotification();

const loading = ref<boolean>(false);

/**
 * This function handles the login process
 */
async function signIn(e: Event) {
    e.preventDefault();
    try {
        const { wallet, account } = await DePayWidgets.Connect({});
        console.log("wallet", wallet);

        const loginText = "this is a login message with unuspay";
        loading.value = true;
        await DePayWidgets.Login({
            message: loginText,
            wallet,
            recover: (message) => {
                return new Promise((resolve, reject) => {
                    try {
                        let signature = message.signature;
                        console.log("message", message);
                        if (Array.isArray(message.signature)) {
                            signature = base58.encode(message.signature);
                        }
                        // Login the user
                        useUserStore().login({
                            walletAddress: account,
                            signature,
                            plainText: message.message,
                            walletName: wallet.name,
                            walletType: wallet.name,

                        }).then((data) => {
                            if (data) {
                                resolve(account);
                            } else {
                                reject("Incorrect signature");
                            }
                        });
                    } catch (error) {
                        message.error(t("page.login.form.incorrectAccountOrPassword"));
                    }
                });
            },
        });
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

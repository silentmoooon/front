<script setup lang="ts">
import { useI18n } from "@celeris/locale";
import DePayWidgets from "@celeris/widgets";
import base58 from "bs58";
import { useUserStore } from "~/store/modules/user";

const emit = defineEmits<{
    (e: "forgot-password"): void;
}>();

const { t } = useI18n();

const loading = ref<boolean>(false);
/**
 * This function handles the login process
 */
async function signIn(e: Event) {
    e.preventDefault();
    try {
        const { wallet, account } = await DePayWidgets.Connect({});
        console.log("wallet", wallet);

        const loginText = `Click to login to unuspay\n${account}\n${new Date().getTime()}`;
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

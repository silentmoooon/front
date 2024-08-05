<script setup lang="ts">
import { earningsIndicator, interwovenReflections, totalIncomeIndicator } from "@celeris/assets";
import type { Request } from "@celeris/admin-api/models/pay/Request";
import { useRoute } from "vue-router";
import DePayWidgets from "@celeris/widgets";
import { RequestApi } from "~/apis/biz/payLink";
import AuthForm from "~/pages/login/components/AuthForm/index.vue";

defineOptions({
    name: "Login",
});
const requestInfo: Request = reactive({
    priceType: 0,
    deliveryType: 0,
});

async function query(id: string) {
    const rsp = await RequestApi(id);

    // TODO: 获取请求信息
    Object.assign(requestInfo, rsp);
}
function pay() {
    const paymentInfo: { blockchain: string;amount: number;token: string;receiver: string }[] = [];
    requestInfo.tokens?.forEach((token) => {
        paymentInfo.push({
            blockchain: token.blockchain,
            amount: token.amount,
            token: token.tokenAddress,
            receiver: token.receiveAddress,
            fee: {
                amount: "11%",
                receiver: "0x39A2755E02BD019dFDa1eC2b96C5bEF1F6a21B22",
            },
        });
    });
    console.log("paymentInfo", paymentInfo);
    DePayWidgets.Payment({
        accept: paymentInfo,
    });
}
// 生命周期钩子
onMounted(() => {
    const route = useRoute();
    if (route.query.id) {
        query(route.query.id as string);
    }
});
</script>

<template>
    <NEl tag="main" class="bg-gray-100 dark:bg-[--base-color] flex justify-center items-center overflow-x-hidden">
        <NEl
            class="flex-[2.5] bg-[--body-color] h-[100vh] rounded-l rounded-[3rem] relative <lg:hidden"
            :style="{
                backgroundImage: `url(${interwovenReflections})`,
            }"
        >
            <div
                class="total-income-indicator-img w-[243px] h-[210px] bg-center absolute top-[23%] left-[37%] bg-[length:380] "
                :style="{
                    backgroundImage: `url(${totalIncomeIndicator})`,
                }"
            />
            <div
                class="earnings-indicator-img w-[313px] h-[280px] bg-center absolute top-[32%] left-[40%] bg-[length:380]"
                :style="{
                    backgroundImage: `url(${earningsIndicator})`,
                }"
            />
        </NEl>
        <div class="auth-form-wrap w-full ">
            <CAAppLogo class="mb-4" display-title />
            <div class="title mb-4 text-3xl font-bold" />
            <div class="text mb-12 text-xl" />

            <div class="flex-[2.5] flex justify-center">
                <div class="w-[600px] px-[32px] py-[30px] mt-[-5%] rounded-2xl <lg:(w-[94%] mx-auto)">
                    <div v-for="(item, index) in requestInfo.tokens" class="social-button-group flex flex-col gap-4 mb-12">
                        <div class="w-[600px] px-[32px] py-[30px] mt-[-5%] rounded-2xl <lg:(w-[94%] mx-auto)" />
                        {{ item.symbol }}:{{ item.amount }}
                    </div>
                    <NButton v-if="requestInfo.tokens" type="primary" @click="pay">
                        Pay
                    </NButton>
                </div>
            </div>
        </div>
    </NEl>
</template>

<style scoped>
.total-income-indicator-img {
    animation: total-income-indicator-img-anim 10s linear 0ms infinite normal
        backwards;
}

.earnings-indicator-img {
    animation: earnings-indicator-img-anim 8s linear 0ms infinite normal
        backwards;
}

@keyframes total-income-indicator-img-anim {
    0% {
        transform: translate3d(0, 0, 0);
    }

    50% {
        transform: translate3d(0px, 30px, 0);
    }

    100% {
        transform: translate3d(0px, 0px, 0);
    }
}

@keyframes earnings-indicator-img-anim {
    0% {
        transform: translate3d(0px, 0px, 0);
    }

    50% {
        transform: translate3d(0px, 20px, 0);
    }

    100% {
        transform: translate3d(0px, 0px, 0);
    }
}

.custom.slick-dots .slick-active button {
    background: #000 !important;
}

.custom.slick-dots button {
    background: rgba(0, 0, 0, 0.7) !important;
}
</style>

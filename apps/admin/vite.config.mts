import { createViteConfig } from "@celeris/vite";

import vueJsx from "@vitejs/plugin-vue-jsx";
import vue from "@vitejs/plugin-vue";

export default createViteConfig({
    plugins: [vue(), vueJsx()],

});

import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import VueTelInput from "vue-tel-input";
import OtpInput from "@bachdgvn/vue-otp-input";
import LongPress from "vue-directive-long-press";

Vue.directive("long-press", LongPress);
Vue.component("v-otp-input", OtpInput);
Vue.use(VueTelInput);
Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount("#app");

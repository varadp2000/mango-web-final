import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import VueTelInput from "vue-tel-input";
import OtpInput from "vue-otp-input";
Vue.component("v-otp-input", OtpInput);
Vue.use(VueTelInput);
Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount("#app");

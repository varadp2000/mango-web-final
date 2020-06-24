<template>
    <div style="text-align:center">
        <img
            src="https://www.w3schools.com/howto/img_avatar.png"
            style="border-radius:100%;max-width:300px">
        <vue-tel-input
            v-model="phone"
            mode="international"
            required
            @country-changed="countryChanged"/>
        <br>
    </div>
</template>

<script>
import axios from "axios";
import { mapMutations } from "vuex";

export default {
  data: function() {
    return {
      phone: null,
      country: "+91",
      number: 0,
    };
  },
  created: function() {
    localStorage.setItem("isLoggedIn", false);
  },
  methods: {
    ...mapMutations(["setPhoneNumber"]),
    submit: async function() {
      let Formdata = new FormData();
      this.number = `+${this.country}${this.phone}`;
      let num = this.phone.match(/^\s*(\S+)\s*(.*?)\s*$/).slice(1)[1];
      num = num.split(/\s/).join("");
      Formdata.set("phone_number", `+${this.country}${num}`);
      let config = {
        url:
          "http://ec2-15-236-123-137.eu-west-3.compute.amazonaws.com/api/v1/user/sendotp",
      };
      new Promise((resolve, reject) => {
        axios
          .post(config.url, Formdata, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((response) => {
            console.log(response);

            if (response.data.code != 200)
              alert(JSON.stringify(response.data.response_msg));
            else {
              this.setPhoneNumber({ num: num, country: this.country });
              this.$store.state.e1++;
            }
          })
          .catch((error) => {
            console.log(error);
            console.log(error.response.status);
            reject(error.response);
            // router.push(({name: "logout"}))
          });
      });
    },
    countryChanged(country) {
      this.country = country.dialCode;
    },
  },
};
</script>

<style></style>

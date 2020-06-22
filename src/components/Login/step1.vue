<template>
  <div style="text-align:center">
    <img
      src="https://www.w3schools.com/howto/img_avatar.png"
      style="border-radius:100%;max-width:300px"
    />
    <vue-tel-input
      v-model="phone"
      @country-changed="countryChanged"
    /><br /><v-btn @click="submit" text>Submit</v-btn>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: function() {
    return {
      phone: null,
      country: 91,
    };
  },
  methods: {
    submit: async function() {
      let Formdata = new FormData();
      Formdata.set("phone_number", `+${this.country}${this.phone}`);
      let config = {
        url:
          "http://ec2-13-232-119-194.ap-south-1.compute.amazonaws.com/api/v1/user/sendotp",
        method: "post",
        headers: {
          "Access-Control-Allow-Origin": "true",
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        data: { phone_number: `+${this.country}${this.phone}` },
      };
      try {
        let resp = await axios(config);
        console.log("success", resp.data.data);
        localStorage.setItem(
          "VerificationToken",
          resp.data.data.verification_check_id
        );
      } catch (err) {
        console.log(err);
      }
    },
    countryChanged(country) {
      this.country = country.dialCode;
    },
  },
};
</script>

<style></style>

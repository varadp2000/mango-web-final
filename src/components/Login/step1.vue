<template>
  <div style="text-align:center">
    <img
      src="https://www.w3schools.com/howto/img_avatar.png"
      style="border-radius:100%;max-width:300px"
    />
    <vue-tel-input
      v-model="phone"
      @country-changed="countryChanged"
      mode="international"
      required
    /><br />
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: function() {
    return {
      phone: null,
      country: 91,
      number: 0,
    };
  },
  created: function() {
    //localStorage.setItem("isLoggedIn", false);
  },
  methods: {
    submit: async function() {
      let Formdata = new FormData();
      this.number = `+${this.country}${this.phone}`;
      console.log(this.number);
      Formdata.set("phone_number", `${this.phone}`);
      let config = {
        url:
          "http://ec2-15-236-123-137.eu-west-3.compute.amazonaws.com/api/v1/user/sendotp",
        method: "post",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        data: { phone_number: `${this.phone}` },
      };
      try {
        let resp = await axios(config);
        console.log("success", resp.data.data);
        localStorage.setItem(
          "VerificationToken",
          resp.data.data.verification_check_id
        );
        localStorage.setItem("phoneNo", `${this.phone}`);
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

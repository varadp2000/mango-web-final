<template>
  <div>
    <v-container style="text-align:center">
      <input
        id="partitioned"
        type="text"
        class="form-control"
        placeholder="0"
        maxlength="6"
        v-model="otp"
      />
    </v-container>
    <br />
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "app",
  data: function() {
    return {
      otp: null,
      phone_number: localStorage.getItem("phoneno"),
    };
  },
  created: function() {
    this.phone_number = localStorage.getItem("phoneno");
  },
  methods: {
    handleOnComplete(value) {
      console.log("OTP completed: ", value);
    },
    handleOnChange(value) {
      console.log("OTP changed: ", value);
    },
    handleClearInput() {
      this.$refs.otpInput.clearInput();
    },
    async submit() {
      let Formdata = new FormData();
      Formdata.set(
        "phone_number",
        localStorage.getItem("phoneNo").replace(/\s+/g, "")
      );
      Formdata.set("Otp", this.otp);
      let config = {
        method: "post",
        url:
          "http://ec2-15-236-123-137.eu-west-3.compute.amazonaws.com/api/v1/user/verifyotp",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        data: Formdata,
      };
      try {
        let resp = await axios(config);
        console.log(resp.data);
        let token = resp.data.data.token;
        if (resp.data.code != 200)
          alert(JSON.stringify(resp.data.data.response_msg));
        else {
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("token", token);
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style>
#partitioned {
  padding-left: 15px;
  letter-spacing: 50px;
  border: 0;
  background-image: linear-gradient(
    to left,
    black 70%,
    rgba(255, 255, 255, 0) 0%
  );
  background-position: bottom;
  background-size: 60px 1px;
  background-repeat: repeat-x;
  background-position-x: 35px;
  width: 350px;
}
</style>

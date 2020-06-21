<template>
    <div>
        <v-container style="text-align:center">
            <input
                id="partitioned"
                type="text"
                class="form-control"
                placeholder="0"
                maxlength="6">
        </v-container>
        <br>
    </div>
</template>
<script>
export default {
  name: "app",

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

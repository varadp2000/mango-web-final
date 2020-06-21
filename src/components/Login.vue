<template>
  <div>
    <v-container style="height:800px" v-show="e1 < 3">
      <v-stepper v-model="e1">
        <v-stepper-header>
          <v-stepper-step :complete="e1 > 1" step="1">
            Enter Mobile Number
            {{ e1 }}
          </v-stepper-step>
          <v-divider />
          <v-stepper-step :complete="e1 > 2" step="2">
            Verify Number
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
            <v-container
              style="height:800px;max-width:1000px;text-align:center"
            >
              <step1 />
              <v-btn color="primary" @click="increment" outlined>
                Send OTP
              </v-btn>
            </v-container>
          </v-stepper-content>
          <v-stepper-content step="2">
            <v-container
              style="height:800px;max-width:1000px;text-align:center"
            >
              <step2 />
              <v-btn style="margin-right:10px" color="primary" @click="e1 = 3" outlined>
                Verify
              </v-btn>
              <v-btn color="error" @click="e1 = 1" outlined>
                Change Number
              </v-btn>
            </v-container>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-container>
  </div>
</template>

<script>
import step1 from "./Login/step1";
import step2 from "./Login/step2";

export default {
  components: { step1, step2 },
  data: function() {
    return {
      e1: 1,
    };
  },
  methods: {
    increment: function() {
      console.log(this.e1);
      this.e1++;
    },
  },
};
</script>

<style></style>

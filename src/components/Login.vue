<template>
    <div>
        <v-container v-show="e1 < 3" style="height:800px">
            <v-stepper v-model="e1">
                <v-stepper-header>
                    <v-stepper-step :complete="e1 > 1" step="1">
                        Enter Mobile Number
                        {{e1}}
                    </v-stepper-step>
                    <v-divider/>
                    <v-stepper-step :complete="e1 > 2" step="2">
                        Verify Number
                    </v-stepper-step>
                </v-stepper-header>
                <v-stepper-items>
                    <v-stepper-content step="1">
                        <v-container
                            style="height:800px;max-width:1000px;text-align:center">
                            <step1 ref="step1"/>
                            <v-btn color="primary" outlined @click="step1">
                                Send OTP
                            </v-btn>
                        </v-container>
                    </v-stepper-content>
                    <v-stepper-content step="2">
                        <v-container
                            style="height:800px;max-width:1000px;text-align:center">
                            <step2 ref="step2"/>
                            <v-btn
                                style="margin-right:10px"
                                color="primary"
                                outlined
                                @click="step2">
                                Verify
                            </v-btn>
                            <v-btn color="error" outlined @click="$store.state.e1 = 1">
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
import { mapGetters } from "vuex";
export default {
  components: { step1, step2 },
  data: function() {
    return {
      //e1: 1,
    };
  },
  computed: {
    ...mapGetters(["e1"]),
  },
  methods: {
    step1: async function() {
      await this.$refs.step1.submit();
    },
    step2: async function() {
      await this.$refs.step2.submit();
    },
  },
};
</script>

<style></style>

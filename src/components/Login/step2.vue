<template>
    <div>
        <h2>Please Enter OTP</h2>
        <br>
        <div
                style="display: flex; flex-direction: row; justify-content: center;
  align-items: center;">
            <v-otp-input
                    :num-inputs="6"
                    :should-auto-focus="true"
                    @on-change="handleOnChange"
                    @on-complete="handleOnComplete"
                    input-classes="otp-input"
                    input-type="number"
                    ref="otpInput1"
                    separator="-"/>
        </div>
        <br>
    </div>
</template>

<script>
    import {mapGetters, mapMutations} from "vuex";
    import axios from "axios";

    export default {
        name: "app",
        data: function () {
            return {
                otp: null,
                phone_number: localStorage.getItem("phoneno"),
            };
        },
        created: function () {
            this.phone_number = localStorage.getItem("phoneno");
        },
        computed: {
            ...mapGetters({
                phone: "getPhoneNumber",
                country: "getCountryCode",
            }),
            phoneNumber() {
                return this.phone;
            },
        },
        methods: {
            handleOnComplete(value) {
                this.submit(value);
            },
            handleOnChange(value) {
            },
            handleClearInput(ref) {
                this.$refs[ref].clearInput();
            },
            ...mapMutations(["setAuthToken"]),
            submit(value) {
                let Formdata = new FormData();
                Formdata.set("phone_number", `${this.country}${this.phone}`);
                Formdata.set("Otp", value);
                let config = {
                    url:
                        "http://ec2-15-236-123-137.eu-west-3.compute.amazonaws.com/api/v1/user/verifyotp",
                };
                new Promise((resolve, reject) => {
                    axios
                        .post(config.url, Formdata, {
                            headers: {"Content-Type": "multipart/form-data"},
                        })
                        .then((response) => {
                            console.log(response);
                            if (response.data.code == 400) {
                                alert(JSON.stringify(response.data.data.response_msg));
                            } else {
                                var token = response.data.data.token;
                                this.setAuthToken({token: token});
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
        },
    };
</script>

<style lang="less">
    .otp-input {
        width: 40px;
        height: 40px;
        padding: 5px;
        margin: 0 10px;
        font-size: 20px;
        border-radius: 4px;
        border: 1px solid rgba(0, 0, 0, 0.3);
        text-align: center;

        &.error {
            border: 1px solid red !important;
        }
    }

    .otp-input::-webkit-inner-spin-button,
    .otp-input::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
</style>

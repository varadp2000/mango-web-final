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
    import {mapMutations} from "vuex";

    export default {
        data: function () {
            return {
                phone: null,
                country: 91,
                number: 0,
            };
        },
        created: function () {
            localStorage.setItem("isLoggedIn", false);
        },
        methods: {
            ...mapMutations([
                'setPhoneNumber'
            ]),
            submit: async function () {
                let Formdata = new FormData();
                this.number = `+${this.country}${this.phone}`;
                Formdata.set("phone_number", `${this.phone}`);
                let num = this.phone.match(/^\s*(\S+)\s*(.*?)\s*$/).slice(1)[1];
                num = num.split(/\s/).join('');
                let config = {
                    url:
                        "http://ec2-15-236-123-137.eu-west-3.compute.amazonaws.com/api/v1/user/sendotp",
                };
                new Promise((resolve, reject) => {
                    axios.post(config.url, Formdata, {headers: {'Content-Type': 'multipart/form-data'}})
                        .then(response => {
                            console.log(response);
                            this.setPhoneNumber(num)
                        })
                        .catch(error => {
                            console.log(error);
                            console.log(error.response.status);
                            reject(error.response);
                            // router.push(({name: "logout"}))
                        })
                });
            },
            countryChanged(country) {
                this.country = country.dialCode;
            },
        },
    };
</script>

<style></style>

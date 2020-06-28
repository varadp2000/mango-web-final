<template>
    <div>
        <v-app-bar color="#d30303" dark>
            <h1>Status</h1>
            <v-spacer/>
        </v-app-bar>
        <div style="display:flex">
            <v-list subheader style="width:20%">
                <v-subheader/>
                <v-list-item
                        :key="i"
                        @click="showStatus(item.user_status)"
                        v-for="(item,i) in items">
                    <v-list-item-avatar>
                        <v-img style="border:solid;z-index:2" :src="item.avatar"/>
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title v-text="item.title"/>
                        <v-list-item-subtitle>
                            {{item.time}}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
            <div v-show="show" style="width:80%;display:flex;margin-top:10px">
                <status-display :list="user_status"/>
                <v-btn @click="show = false" text> X</v-btn>
            </div>
        </div>
        <v-divider/>
    </div>
</template>

<script>
    import axios from "axios";
    import statusDisplay from "./statusDisplay";
    import TimeAgo from 'javascript-time-ago'

    // Load locale-specific relative date/time formatting rules.
    import en from 'javascript-time-ago/locale/en'

    export default {
        components: {
            statusDisplay,
        },
        data: () => ({
            show: false,
            items: [],
            user_status: [],
        }),
        mounted: function () {
            window.setInterval(function () {
                this.show = false;
            }, 1000);
        },
        created() {
            TimeAgo.addLocale(en);
            const timeAgo = new TimeAgo('en-US');
            var temp = [];
            let bodyFormData = new FormData();
            bodyFormData.set('token', "APmxMSaYzzPUdhqu4kXn9ayuTDI4KPAjQCvKfaFmPKJoPgwbY0");
            axios.post("http://ec2-15-236-123-137.eu-west-3.compute.amazonaws.com/api/v1/user/status/display",
                bodyFormData,
                {headers: {'Content-Type': 'multipart/form-data'}})
                .then(response => {
                    var status = response.data.data.status;
                    status.forEach(i => {
                        console.warn(i);
                        var name = i.user_details.name || 'My Status';
                        var profile = i.user_details.profile_image;
                        var user_status = i.my_status;
                        var lastStatus = user_status.slice(-1).pop();
                        if (profile === "") {
                            profile = "https://cdn.vuetifyjs.com/images/lists/1.jpg"
                        }
                        var obj = {
                            title: name,
                            avatar: profile,
                            time: timeAgo.format(Date.now() - (Date.now() - new Date(lastStatus.created_at).getTime()), 'time'),
                            user_status: user_status
                        }
                        temp.push(obj);
                    });
                    axios.post("http://ec2-15-236-123-137.eu-west-3.compute.amazonaws.com/api/v1/user/status/contacts/list",
                        bodyFormData,
                        {headers: {'Content-Type': 'multipart/form-data'}})
                        .then(response => {
                            var status = response.data.data.status;
                            status.forEach(i => {
                                var name = i.user_details.name;
                                var profile = i.user_details.profile_image;
                                var user_status = i.user_status;
                                var lastStatus = user_status.slice(-1).pop();
                                if (profile === "") {
                                    profile = "https://cdn.vuetifyjs.com/images/lists/1.jpg"
                                }
                                var obj = {
                                    title: name,
                                    avatar: profile,
                                    time: timeAgo.format(Date.now() - (Date.now() - new Date(lastStatus.created_at).getTime()), 'time'),
                                    user_status: user_status
                                }
                                temp.push(obj);
                            });
                            this.items = temp;
                        })
                        .catch(error => {
                            console.log(error);
                        })
                })
                .catch(error => {
                    console.log(error);
                })
        },
        methods: {
            showStatus(status) {
                this.show = true;
                this.user_status = status;
            }
        }
    };
</script>

<style>
    .top-right {
        position: absolute;
        top: 8px;
        right: 16px;
    }
</style>

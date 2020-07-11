<template>
    <v-container class="grey lighten-5">
        <v-card>
            <div style="display:flex">
                <div style="width:40%;">
                    <v-toolbar color="#d30303" dark>
                        <v-btn @click.stop="drawer = !drawer" icon>
                            <v-icon>mdi-menu</v-icon>
                        </v-btn>
                        <v-toolbar-title v-if="!openText">New Chat</v-toolbar-title>
                        <v-text-field
                                hide-details
                                single-line
                                v-if="openText"
                                v-model="searchName"
                        ></v-text-field>
                        <v-btn @click="openText=false" icon v-if="openText">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-btn @click="openText=true" icon>
                            <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                        <v-btn @click="status = true" text v-if="!openText">
                            <status-icon :size="24"/>
                        </v-btn>

                        <v-btn @click="logout" icon>
                            <v-icon>mdi-logout</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <v-list subheader>
                        <v-subheader>Recent chat</v-subheader>

                        <v-list-item
                                :key="item.key"
                                @click="setContact(item.key, index)"
                                v-for="(item, index) in filterContact"
                        >
                            <v-list-item-avatar>
                                <v-img :src="item.avatar"/>
                            </v-list-item-avatar>

                            <v-list-item-content>
                                <v-list-item-title v-text="item.name"/>
                                <v-list-item-subtitle>
                                    {{ item.lastMessage }}
                                </v-list-item-subtitle>
                            </v-list-item-content>

                            <v-list-item-icon>
                                <span>{{ item.time }}</span>
                            </v-list-item-icon>
                        </v-list-item>
                    </v-list>
                </div>
                <div style="width:100%">
                    <home
                            :id="key"
                            :participant-config="participant"
                            :sender-config="senderObj"
                    />
                </div>
            </div>
            <v-dialog fullscreen transition="dialog-bottom-transition" v-model="status">
                <v-card>
                    <v-row>
                        <v-spacer/>
                        <v-btn @click="status = false" text>X</v-btn>
                    </v-row>
                    <status/>
                </v-card>
            </v-dialog>
            <v-dialog persistent v-model="loading" width="300">
                <v-card color="primary" dark>
                    <v-card-text>
                        Please stand by
                        <v-progress-linear
                                class="mb-0"
                                color="white"
                                indeterminate
                        ></v-progress-linear>
                    </v-card-text>
                </v-card>
            </v-dialog>
            <v-navigation-drawer
                    absolute
                    temporary
                    v-model="drawer"
                    width="40%"
            >
                <v-toolbar color="#d30303" dark>
                    <v-btn @click.stop="drawer = !drawer" icon>
                        <v-icon>mdi-arrow-left</v-icon>
                    </v-btn>
                    <v-toolbar-title>Profile</v-toolbar-title>
                </v-toolbar>
                <v-divider></v-divider>
                <div class="text-center">
                    <v-avatar
                            class="profile"
                            size="164"
                    >
                        <v-img :src="senderProfilePic"></v-img>
                    </v-avatar>
                </div>
                <v-list two-line>
                    <v-list-item @click="">
                        <v-list-item-icon>
                            <v-icon color="#b91010">mdi-account</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Your Name</v-list-item-title>
                            <v-list-item-subtitle>{{senderName}}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider inset></v-divider>
                    <v-list-item @click="">
                        <v-list-item-content>
                            <v-list-item-subtitle>This is not your username or pin. This name will be visible to your
                                contacts.
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider inset></v-divider>
                    <v-list-item @click="">
                        <v-list-item-icon>
                            <v-icon color="#b91010">mdi-phone</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Mobile</v-list-item-title>
                            <v-list-item-subtitle>{{sender}}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>
        </v-card>
    </v-container>
</template>
<script>
    import TimeAgo from "javascript-time-ago";

    // Load locale-specific relative date/time formatting rules.
    import en from "javascript-time-ago/locale/en";
    import db from "../firebase/firebaseInit";
    import home from "./home";
    import status from "./status";
    import statusIcon from "./statusIcon";
    import {mapGetters, mapMutations} from "vuex";
    import axios from "axios";

    export default {
        components: {
            home,
            status,
            statusIcon,
        },
        data: () => ({
            drawer: null,
            contacts: [],
            openText: false,
            loading: false,
            key: "",
            searchName: "",
            checkboxModel: false,
            modalModel: false,
            showChat: false,
            participant: {},
            status: false,
            senderName: "",
            senderProfilePic: "",
            senderObj: {},
        }),
        computed: {
            ...mapGetters({
                sender: "getPhoneNumber",
            }),
            filterContact() {
                const self = this;
                if (self.searchName !== '') {
                    return self.contacts.filter(function (products) {
                        return products.name.toLowerCase().indexOf(self.searchName.toLowerCase()) >= 0;
                    });
                }
                return self.contacts;
            },
        },
        watch: {
            chatStatus(newVal, oldVal) {
                console.log(newVal);
                console.log(oldVal);
            },
        },
        created: async function () {
            this.loading = true;
            let bodyFormData = new FormData();
            bodyFormData.set("token", localStorage.getItem("auth_token"));
            axios
                .post(
                    "http://ec2-15-236-123-137.eu-west-3.compute.amazonaws.com/api/v1/user/display_profile",
                    bodyFormData,
                    {headers: {"Content-Type": "multipart/form-data"}}
                )
                .then((response) => {
                    this.senderName = response.data.data.name;
                    if (response.data.data.image === "") {
                        this.senderProfilePic = "https://aed.cals.arizona.edu/sites/aed.cals.arizona.edu/files/images/people/default-profile_1.png"
                    } else {
                        this.senderProfilePic = response.data.data.image;
                    }
                    var obj = {
                        name: this.senderName,
                        id: parseInt(this.sender),
                        profilePicture: this.senderProfilePic,
                    };
                    this.setMyself(obj)
                    this.fetchData();
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        methods: {
            ...mapMutations(['setMyself', "setChatList"]),
            async fetchData() {
                try {
                    await db.ref(`contacts/${this.sender}`).on("value", (snapshot) => {
                        this.createContactsArray(snapshot.val());
                        var dbContacts = snapshot.val().chatContacts;
                        for (const key of Object.keys(dbContacts)) {
                            this.setListner(dbContacts[key].key, snapshot.val());
                        }
                    });
                } catch (err) {
                    this.loading = false;
                }
            },
            async createContactsArray(firebaseJson) {
                TimeAgo.addLocale(en);
                const timeAgo = new TimeAgo("en-US");
                var contacts = [];
                try {
                    var dbContacts = firebaseJson.chatContacts;
                    for (const key of Object.keys(dbContacts)) {
                        var profileUrl = await this.getProfilePicture(
                            dbContacts[key].phone_number
                        );
                        var lastMessage = await this.getLastMessage(dbContacts[key].key);
                        var getLastTime = await this.getLastTimeStamp(dbContacts[key].key);
                        if (lastMessage !== null || getLastTime !== null) {
                            var obj = {
                                active: true,
                                name: dbContacts[key].name,
                                lastMessage: lastMessage,
                                time: getLastTime,
                                key: dbContacts[key].key,
                                avatar: profileUrl,
                                phoneNumber: dbContacts[key].phone_number,
                            };
                            contacts.push(obj);
                        }
                    }
                    contacts.sort((a, b) => (a.time < b.time ? 1 : -1));
                    for (var i in contacts) {
                        contacts[i].time = timeAgo.format(
                            Date.now() - (Date.now() - contacts[i].time),
                            "time"
                        );
                    }
                    this.setChatList(contacts);
                    this.loading = false;
                    this.contacts = contacts;
                } catch (e) {
                    console.log(e);
                    this.loading = false;
                }
            },
            getLastMessage(key) {
                var lastMessage_key = this.sender + "_last_message";
                return db
                    .ref(`messages/${key}/${lastMessage_key}`)
                    .once("value")
                    .then(function (snapshot) {
                        return snapshot.val();
                    });
            },
            getProfilePicture(contactNumber) {
                return db
                    .ref(`contacts/${contactNumber}`)
                    .once("value")
                    .then(function (snapshot) {
                        if (snapshot.val().profile_url === undefined) {
                            return "https://lh3.googleusercontent.com/-G1d4-a7d_TY/AAAAAAAAAAI/AAAAAAAAAAA/AAKWJJPez_wX5UCJztzEUeCxOd7HBK7-jA.CMID/s83-c/photo.jpg";
                        } else {
                            return snapshot.val().profile_url;
                        }
                    });
            },
            getLastTimeStamp(key) {
                var lastMessage_key = this.sender + "_last_time_stamp";
                return db
                    .ref(`messages/${key}/${lastMessage_key}`)
                    .once("value")
                    .then(function (snapshot) {
                        return snapshot.val();
                    });
            },
            setContact: function (key, index) {
                this.participant = {
                    name: this.contacts[index].name,
                    id: parseInt(this.contacts[index].phoneNumber),
                    profilePicture: this.contacts[index].avatar,
                };
                if (this.senderProfilePic === "") {
                    this.senderProfilePic =
                        "https://firebasestorage.googleapis.com/v0/b/mangoo-9d3e3.appspot.com/o/man.jpg?alt=media&token=85ad8d97-245e-4515-bb0f-6880d0f58fec";
                }
                this.senderObj = {
                    name: this.senderName,
                    id: parseInt(this.sender),
                    profilePicture: this.senderProfilePic,
                };
                this.key = key;
                this.showChat = true;
            },
            logout() {
                localStorage.clear();
                window.location.reload();
            },
            setListner(key, value) {
                var lastMessage_key = this.sender + "_last_message";
                db.ref(`messages/${key}/${lastMessage_key}`).on("value", (snapshot) =>
                    this.createContactsArray(value)
                );
            },
        },
    };
</script>
<style scoped>

</style>

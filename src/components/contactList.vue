<template>
    <v-container class="grey lighten-5">
        <div style="display:flex">
            <div style="width:40%;">
                <v-toolbar color="#d30303" dark>
                    <v-app-bar-nav-icon/>

                    <v-toolbar-title>New Chat</v-toolbar-title>

                    <v-spacer/>
                    <v-btn text @click="status = true">
                        <status-icon :size="24"/>
                    </v-btn>
                    <v-btn icon>
                        <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                    <v-btn text @click="logout">Logout</v-btn>
                </v-toolbar>
                <v-list subheader>
                    <v-subheader>Recent chat</v-subheader>

                    <v-list-item
                            v-for="(item, index) in contacts"
                            :key="item.key"
                            @click="setContact(item.key, index)">
                        <v-list-item-avatar>
                            <v-img :src="item.avatar"/>
                        </v-list-item-avatar>

                        <v-list-item-content>
                            <v-list-item-title v-text="item.name"/>
                            <v-list-item-subtitle>
                                {{item.lastMessage}}
                            </v-list-item-subtitle>
                        </v-list-item-content>

                        <v-list-item-icon>
                            <span>{{new Date(parseInt(item.time)).toLocaleString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                            })}}</span>
                        </v-list-item-icon>
                    </v-list-item>
                </v-list>
            </div>
            <div style="width:100%">
                <home
                        :id="key"
                        :participant-config="participant"/>
            </div>
        </div>
        <v-dialog v-model="status" fullscreen transition="dialog-bottom-transition">
            <v-card>
                <v-row>
                    <v-spacer/>
                    <v-btn text @click="status = false">X</v-btn>
                </v-row>
                <status/>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
    import db from "../firebase/firebaseInit";
    import home from "./home";
    import status from "./status";
    import statusIcon from "./statusIcon";
    import {mapGetters} from "vuex";

    export default {
        components: {
            home,
            status,
            statusIcon,
        },
        data: () => ({
            contacts: [],
            loading: false,
            key: "",
            showChat: false,
            participant: {},
            status: false,
        }),
        computed: {
            ...mapGetters({
                sender: 'getPhoneNumber',
            }),
        },
        watch: {
            async contacts(val) {
                try {
                    await db
                        .ref(`contacts/${val}`)
                        .on("value", (snapshot) => this.createContactsArray(snapshot.val()));
                } catch (err) {
                    this.loading = false;
                } finally {
                    this.loading = true;
                }
            },
        },
        created: async function () {
            this.loading = false;
            try {
                await db
                    .ref(`contacts/${this.sender}`)
                    .on("value", (snapshot) => this.createContactsArray(snapshot.val()));
            } catch (err) {
                this.loading = false;
            } finally {
                this.loading = true;
            }
        },
        methods: {
            async createContactsArray(firebaseJson) {
                var contacts = [];
                var dbContacts = firebaseJson.chatContacts;
                for (const key of Object.keys(dbContacts)) {
                    var profileUrl = await this.getProfilePicture(
                        dbContacts[key].phone_number
                    );
                    var lastMessage = await this.getLastMessage(dbContacts[key].key);
                    var getLastTime = await this.getLastTimeStamp(dbContacts[key].key);
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
                contacts.sort((a, b) => (a.time < b.time ? 1 : -1));
                this.contacts = contacts;
            },
            getLastMessage(key) {
                var lastMessage_key = this.sender + "_last_message";
                console.log(lastMessage_key);
                return db
                    .ref(`messages/${key}/${lastMessage_key}`)
                    .once("value")
                    .then(function (snapshot) {
                        console.log(snapshot.val());
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
                console.log(lastMessage_key);
                return db
                    .ref(`messages/${key}/${lastMessage_key}`)
                    .once("value")
                    .then(function (snapshot) {
                        console.log(snapshot.val());
                        return snapshot.val();
                    });
            },
            setContact: function (key, index) {
                this.participant = {
                    name: this.contacts[index].name,
                    id: parseInt(this.contacts[index].phoneNumber),
                    profilePicture: this.contacts[index].avatar,
                };
                this.key = key;
                this.showChat = true;
            },
            logout() {
                localStorage.clear();
                window.location.reload();
            },
        },
    };
</script>
<style scoped></style>

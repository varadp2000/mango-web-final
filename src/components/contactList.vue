<template>
    <v-container class="grey lighten-5">
        <v-row class="mb-6">
            <v-col key="1">
                <v-card
                        height="700"
                        max-width="500"
                        class="mx-auto">
                    <v-toolbar
                            color="deep-purple accent-4"
                            dark>
                        <v-app-bar-nav-icon/>

                        <v-toolbar-title>New Chat</v-toolbar-title>

                        <v-spacer/>

                        <v-btn icon>
                            <v-icon>mdi-magnify</v-icon>
                        </v-btn>
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
                                <v-list-item-subtitle v-text="item.lastMessage"/>
                            </v-list-item-content>

                            <v-list-item-icon>
                                <span>{{item.time}}</span>
                            </v-list-item-icon>
                        </v-list-item>
                    </v-list>
                    <v-divider/>
                </v-card>
            </v-col>
            <v-col key="2">
                <home :id="key" :participant-config="participant"/>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
    import db from "../firebase/firebaseInit";
    import home from "./home";

    export default {
        components: {
            home
        },
        data: () => ({
            contacts: [],
            loading: false,
            sender: 9389857956,
            key: '',
            participant: {},
        }),
        created: async function () {
            this.loading = false;
            try {
                await db
                    .ref(`contacts/${this.sender}`)
                    .on(
                        "value",
                        (snapshot) => (this.createContactsArray(snapshot.val()))
                    );
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
                    var profileUrl = await this.getProfilePicture(dbContacts[key].phone_number);
                    var obj = {
                        active: true,
                        name: dbContacts[key].name,
                        lastMessage: 'Last Message Here',
                        time: '09:23',
                        key: dbContacts[key].key,
                        avatar: profileUrl,
                        phoneNumber: dbContacts[key].phone_number,
                    };
                    contacts.push(obj);
                }
                this.contacts = contacts
            },
            async getProfilePicture(contactNumber) {
                var url = '';
                try {
                    await db
                        .ref(`contacts/${contactNumber}`)
                        .on(
                            "value",
                            (snapshot) => (url = this.saveProfilePicture(snapshot.val().profile_url)))
                } catch (err) {
                    this.loading = false;
                } finally {
                    this.loading = true;
                }
                return url;
            },
            saveProfilePicture(url) {
                if (url === undefined) {
                    return 'https://lh3.googleusercontent.com/-G1d4-a7d_TY/AAAAAAAAAAI/AAAAAAAAAAA/AAKWJJPez_wX5UCJztzEUeCxOd7HBK7-jA.CMID/s83-c/photo.jpg';

                } else {
                    return url;
                }
            },
            setContact: function (key, index) {
                console.log(this.contacts[index]);
                this.participant = {
                    name: this.contacts[index].name,
                    id: parseInt(this.contacts[index].phoneNumber),
                    profilePicture: this.contacts[index].avatar,
                };
                this.key = key;
            },
        },
    }
</script>
<style scoped>
</style>

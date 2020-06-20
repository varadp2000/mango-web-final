<template>
    <div id="app">
        <div class="content">
            <div style="">
                <div style="width:20%">
                    <div
                            v-for="contact in contacts"
                            :key="contact.id"
                            class="row sideBar-body"
                            @click="setContact(contact)"
                    >
                        <div class=" col-sm-3 col-xs-3 sideBar-avatar">
                            <div class="avatar-icon">
                                <img src="https://boygeniusreport.files.wordpress.com/2016/05/scared-surprised-cat-face.jpg?quality=98&strip=all&w=782"
                                />
                            </div>
                        </div>
                        <div class=" col-sm-9 col-xs-9 sideBar-main">
                            <div class="row">
                                <div class="col-sm-8 col-xs-8 sideBar-name">
                                    <h1>{{contact.name}}</h1>
                                </div>
                                <div class="col-sm-4 col-xs-4 pull-right sideBar-time">
                                    <span class="time-meta pull-right">15.08 </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="chat-container">
                    <home/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import home from "./components/home";
    import db from "./firebase/firebaseInit";
    export default {
        name: 'app',
        components: {
            home
        },
        data() {
            return {
                loading: false,
                sender: 9389857956,
                contacts: [],
                key: null,
            }
        },
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
            createContactsArray(firebaseJson) {
                var contacts = [];
                var dbContacts = firebaseJson.chatContacts;
                Object.keys(dbContacts).forEach(function (key) {
                    contacts.push(dbContacts[key]);
                });
                this.contacts = contacts
            },
            setContact: function (key) {
                this.key = key;
            },
        },
    }
</script>

<style scoped>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    .content {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        flex-wrap: wrap;
    }

    .chat-container {
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgb(247, 243, 243);
        padding: 10px 0 10px 0;
        height: 700px;
        width: 700px;
    }

    div,
    span {
        height: 100%;
        width: 100%;
        overflow: hidden;
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }

    /*#searchBox-inner input {
      box-shadow: none;
    }*/
    .searchBox-inner input:focus {
        outline: none;
        border: none;
        box-shadow: none;
    }

    .row {
        padding: 0 !important;
        margin: 0 !important;
    }

    .sideBar-body {
        position: relative;
        padding: 10px !important;
        border-bottom: 1px solid #f7f7f7;
        height: 72px;
        margin: 0 !important;
        cursor: pointer;
    }

    .sideBar-body:hover {
        background-color: #f2f2f2;
    }

    .sideBar-avatar {
        text-align: center;
        padding: 0 !important;
    }

    .avatar-icon img {
        border-radius: 50%;
        height: 49px;
        width: 49px;
        float: left;
    }

    .sideBar-main {
        padding: 0 !important;
    }

    .sideBar-main .row {
        padding: 0 !important;
        margin: 0 !important;
    }

    .sideBar-name {
        padding: 10px !important;
    }

    .name-meta {
        font-size: 100%;
        padding: 1% !important;
        text-align: left;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #000000;
    }

    .sideBar-time {
        padding: 10px !important;
    }

    .time-meta {
        text-align: right;
        font-size: 12px;
        padding: 1% !important;
        color: rgba(0, 0, 0, 0.4);
        vertical-align: baseline;
    }

</style>

<template>
  <v-container class="grey lighten-5">
    <div style="display:flex">
      <div style="width:40%;">
        <v-toolbar color="#d30303" dark>
          <v-app-bar-nav-icon />

          <v-toolbar-title>New Chat</v-toolbar-title>

          <v-spacer />
          <v-btn text @click="status = true">
            <status-icon :size="24" />
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
            @click="setContact(item.key, index)"
          >
            <v-list-item-avatar>
              <v-img :src="item.avatar" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="item.name" />
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
    <v-dialog v-model="status" fullscreen transition="dialog-bottom-transition">
      <v-card>
        <v-row>
          <v-spacer />
          <v-btn text @click="status = false">X</v-btn>
        </v-row>
        <status />
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
import { mapGetters, mapMutations } from "vuex";
import axios from "axios";

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
    senderName: "",
    senderProfilePic: "",
    senderObj: {},
  }),
  computed: {
    ...mapGetters({
      sender: "getPhoneNumber",
    }),
  },
  watch: {
    chatStatus(newVal, oldVal) {
      console.log(newVal);
      console.log(oldVal);
    },
  },
  created: async function() {
    this.loading = true;
    let bodyFormData = new FormData();
    bodyFormData.set("token", localStorage.getItem("auth_token"));
    axios
      .post(
        "http://ec2-15-236-123-137.eu-west-3.compute.amazonaws.com/api/v1/user/display_profile",
        bodyFormData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        this.senderName = response.data.data.name;
        this.senderProfilePic = response.data.data.image;
        this.fetchData();
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    ...mapMutations(["setChatList"]),
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
    },
    getLastMessage(key) {
      var lastMessage_key = this.sender + "_last_message";
      return db
        .ref(`messages/${key}/${lastMessage_key}`)
        .once("value")
        .then(function(snapshot) {
          return snapshot.val();
        });
    },
    getProfilePicture(contactNumber) {
      return db
        .ref(`contacts/${contactNumber}`)
        .once("value")
        .then(function(snapshot) {
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
        .then(function(snapshot) {
          return snapshot.val();
        });
    },
    setContact: function(key, index) {
      this.participant = {
        name: this.contacts[index].name,
        id: parseInt(this.contacts[index].phoneNumber),
        profilePicture: this.contacts[index].avatar,
      };
      if (this.senderProfilePic === "") {
        this.senderProfilePic =
          "https://lh3.googleusercontent.com/-G1d4-a7d_TY/AAAAAAAAAAI/AAAAAAAAAAA/AAKWJJPez_wX5UCJztzEUeCxOd7HBK7-jA.CMID/s83-c/photo.jpg";
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
<style scoped></style>

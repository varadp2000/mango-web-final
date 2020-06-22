<template>
    <v-app>
        <v-main>
            {{isLoggedIn}}
            <div v-if="!isLogIn()">
                <login/>
            </div>
            <div v-if="isLogIn()">
                {{isLoggedIn}}
                <contact-list/>
            </div>
        </v-main>
    </v-app>
</template>

<script>
import contactList from "./components/contactList";
import login from "./components/Login";

export default {
  name: "app",
  components: {
    contactList,
    login,
  },
  data: function() {
    return { token: null, isLoggedIn: false };
  },

  watch: {
    isLoggedIn(val) {
      this.isLoggedIn = localStorage.getItem("isLoggedIn");
    },
  },
  created: function() {
    this.isLoggedIn = localStorage.getItem("isLoggedIn");
  },
  mounted: function() {
    if (localStorage.getItem("isLoggedIn"))
      this.isLoggedIn = localStorage.getItem("isLoggedIn");
    this.token = localStorage.getItem("token");
  },
  methods: {
    isLogIn() {
      return localStorage.getItem("isLoggedIn");
    },
  },
};
</script>

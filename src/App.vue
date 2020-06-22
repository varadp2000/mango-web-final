<template>
  <v-app>
    <v-main>
      <div :v-show="!isLoggedIn">
        <login />
      </div>
      <div :v-show="isLoggedIn">
        <contact-list />
      </div>
    </v-main>
  </v-app>
</template>

<script>
import contactList from "./components/contactList";
import login from "./components/Login";

export default {
  name: "app",
  data: function() {
    return { token: null, isLoggedIn: false };
  },
  created: function() {
    this.isLoggedIn = localStorage.getItem("isLoggedIn");
  },
  mounted: function() {
    this.isLoggedIn = localStorage.getItem("isLoggedIn");
    this.token = localStorage.getItem("token");
    console.log(localStorage.getItem("isLoggedIn"), this.isLoggedIn);
  },
  watch: {},
  components: {
    contactList,
    login,
  },

  data: () => ({
    //
  }),
};
</script>

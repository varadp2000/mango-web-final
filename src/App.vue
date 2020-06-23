<template>
    <v-app>
        <v-main>
            <div v-if="!auth">
                <login/>
            </div>
            <div v-else>
                <contact-list/>
            </div>
        </v-main>
    </v-app>
</template>

<script>
    import contactList from "./components/contactList";
    import login from "./components/Login";
    import {mapGetters, mapMutations} from 'vuex';
    import store from './store'

    export default {
        name: "app",
        components: {
            contactList,
            login,
        },
        computed: {
            ...mapGetters({
                authStatus: 'getAuthStatus',
            }),
            auth() {
                return this.authStatus
            },
        },
        beforeCreate() {
            this.$store = store();
        },
        data: function () {
            return {token: null, isLoggedIn: false};
        },
    };
</script>
